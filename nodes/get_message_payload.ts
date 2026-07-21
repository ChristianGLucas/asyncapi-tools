import { MessageRequest, GetMessagePayloadOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, detectVersion, findMessageRaw, safeJsonStringify } from './lib';

/**
 * Extracts one message's payload (and headers) schema by name — looked up
 * first in `components.messages`, then among inline (non-$ref) message
 * definitions found under a channel's publish/subscribe/messages. The
 * payload/headers schema is returned as-is (serialized as JSON), with any
 * internal $ref it contains left unresolved — use ExtractMessageSchemas
 * if you want the payload's top-level $ref followed. `found` is false
 * (with empty payload_json/headers_json) when no message with that name
 * exists in the document.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getMessagePayload(ax: AxiomContext, input: MessageRequest): GetMessagePayloadOutput {
  const out = new GetMessagePayloadOutput();
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
  const name = input.getMessageName();
  if (name === '') {
    out.setError('message_name is required');
    return out;
  }
  const raw = findMessageRaw(doc, majorVersion, name);
  if (raw === undefined) {
    out.setError(`no message named "${name}" found`);
    return out;
  }
  out.setFound(true);
  out.setPayloadJson(raw.payload !== undefined ? safeJsonStringify(raw.payload) : '{}');
  out.setHeadersJson(raw.headers !== undefined ? safeJsonStringify(raw.headers) : '{}');
  out.setContentType(typeof raw.contentType === 'string' ? raw.contentType : '');
  return out;
}
