import { AsyncApiDocument, ExtractMessageSchemasOutput, MessageSchemaRef } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parseDocument,
  looksLikeDocument,
  detectVersion,
  listMessageEntries,
  findMessageRaw,
  isPlainObject,
  isInternalRef,
  resolveJsonPointer,
  safeJsonStringify,
} from './lib';

/**
 * For every message DEFINITION in the document (same set ListMessages
 * finds), extracts its payload's schema reference: whether the payload is
 * a `$ref` (vs. an inline schema), the raw $ref target string if so,
 * whether that ref is external (a remote URL/file path — never fetched,
 * only flagged), and the schema actually resolved to — following one
 * internal same-document $ref hop when payload_is_ref is true, else the
 * inline payload itself. This is the "what schema does each message
 * actually carry" index; use GetMessagePayload to fetch a single one by
 * name.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractMessageSchemas(ax: AxiomContext, input: AsyncApiDocument): ExtractMessageSchemasOutput {
  const out = new ExtractMessageSchemasOutput();
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

  const rows: MessageSchemaRef[] = [];
  for (const m of listMessageEntries(doc, majorVersion)) {
    const raw = findMessageRaw(doc, majorVersion, m.name);
    const row = new MessageSchemaRef();
    row.setMessageName(m.name);
    if (raw === undefined || raw.payload === undefined) {
      row.setPayloadIsRef(false);
      row.setPayloadRef('');
      row.setRefIsExternal(false);
      row.setResolvedSchemaJson('{}');
      rows.push(row);
      continue;
    }
    const payload = raw.payload;
    if (isPlainObject(payload) && typeof payload.$ref === 'string') {
      const ref = payload.$ref;
      row.setPayloadIsRef(true);
      row.setPayloadRef(ref);
      const external = !isInternalRef(ref);
      row.setRefIsExternal(external);
      if (external) {
        row.setResolvedSchemaJson('{}');
      } else {
        const resolved = resolveJsonPointer(doc, ref);
        row.setResolvedSchemaJson(resolved !== undefined ? safeJsonStringify(resolved) : '{}');
      }
    } else {
      row.setPayloadIsRef(false);
      row.setPayloadRef('');
      row.setRefIsExternal(false);
      row.setResolvedSchemaJson(safeJsonStringify(payload));
    }
    rows.push(row);
  }
  out.setSchemasList(rows);
  return out;
}
