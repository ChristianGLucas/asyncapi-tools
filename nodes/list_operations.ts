import { AsyncApiDocument, ListOperationsOutput, OperationSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, detectVersion, listOperationEntries } from './lib';

/**
 * Lists every operation in the document, unified across spec generations:
 * for a 2.x document, every channel's `publish:`/`subscribe:` block
 * flattened into one operation each (action = "publish"/"subscribe" — the
 * field name under the channel); for a 3.x document, every entry in the
 * top-level `operations:` map (action = the declared "send"/"receive",
 * channel = resolved from the operation's `channel:` $ref). Each entry
 * also carries its operationId (2.x) / operation key (3.x), summary,
 * description, and resolved message name(s).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listOperations(ax: AxiomContext, input: AsyncApiDocument): ListOperationsOutput {
  const out = new ListOperationsOutput();
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
  out.setMajorVersion(majorVersion);

  const operations = listOperationEntries(doc, majorVersion).map((o) => {
    const s = new OperationSummary();
    s.setOperationId(o.operationId);
    s.setAction(o.action);
    s.setChannel(o.channel);
    s.setSummary(o.summary);
    s.setDescription(o.description);
    s.setMessageNamesList(o.messageNames);
    return s;
  });
  out.setOperationsList(operations);
  return out;
}
