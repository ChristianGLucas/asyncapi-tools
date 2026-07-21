import { AsyncApiDocument, ExtractMessageBindingsOutput, BindingEntry } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, extractMessageBindingRows } from './lib';

/**
 * Extracts every message's protocol-specific `bindings:` block as
 * structured facts: one row per (message, protocol) pair, with that
 * protocol's binding object reported as opaque JSON. Scanned across
 * `components.messages` — the canonical, addressable collection every
 * message ultimately resolves through. Messages with no `bindings:`
 * contribute no rows.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractMessageBindings(ax: AxiomContext, input: AsyncApiDocument): ExtractMessageBindingsOutput {
  const out = new ExtractMessageBindingsOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const rows = extractMessageBindingRows(data as Record<string, unknown>).map((r) => {
    const e = new BindingEntry();
    e.setScopeName(r.scopeName);
    e.setProtocol(r.protocol);
    e.setBindingsJson(r.bindingsJson);
    return e;
  });
  out.setBindingsList(rows);
  return out;
}
