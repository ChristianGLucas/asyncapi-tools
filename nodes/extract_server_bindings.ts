import { AsyncApiDocument, ExtractServerBindingsOutput, BindingEntry } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, extractServerBindingRows } from './lib';

/**
 * Extracts every server's protocol-specific `bindings:` block as
 * structured facts: one row per (server, protocol) pair, with that
 * protocol's binding object reported as opaque JSON (binding shapes are
 * protocol-defined — kafka bindings look nothing like mqtt bindings — so
 * the body is not modeled field-by-field). This shape is identical
 * between AsyncAPI 2.x and 3.x. Servers with no `bindings:` contribute no
 * rows.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractServerBindings(ax: AxiomContext, input: AsyncApiDocument): ExtractServerBindingsOutput {
  const out = new ExtractServerBindingsOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const rows = extractServerBindingRows(data as Record<string, unknown>).map((r) => {
    const e = new BindingEntry();
    e.setScopeName(r.scopeName);
    e.setProtocol(r.protocol);
    e.setBindingsJson(r.bindingsJson);
    return e;
  });
  out.setBindingsList(rows);
  return out;
}
