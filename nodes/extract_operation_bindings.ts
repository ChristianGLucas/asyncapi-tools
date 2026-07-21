import { AsyncApiDocument, ExtractOperationBindingsOutput, BindingEntry } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, detectVersion, extractOperationBindingRows } from './lib';

/**
 * Extracts every operation's protocol-specific `bindings:` block as
 * structured facts: one row per (operation, protocol) pair, with that
 * protocol's binding object reported as opaque JSON. Version-aware: for a
 * 2.x document, bindings live on each channel's `publish:`/`subscribe:`
 * block (scope_name = its operationId, or "<channel>.<publish|subscribe>"
 * when operationId is undeclared); for a 3.x document, bindings live
 * directly on each top-level operation (scope_name = the operation key).
 * Operations with no `bindings:` contribute no rows.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractOperationBindings(ax: AxiomContext, input: AsyncApiDocument): ExtractOperationBindingsOutput {
  const out = new ExtractOperationBindingsOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const doc = data as Record<string, unknown>;
  const { majorVersion } = detectVersion(doc);
  const rows = extractOperationBindingRows(doc, majorVersion).map((r) => {
    const e = new BindingEntry();
    e.setScopeName(r.scopeName);
    e.setProtocol(r.protocol);
    e.setBindingsJson(r.bindingsJson);
    return e;
  });
  out.setBindingsList(rows);
  return out;
}
