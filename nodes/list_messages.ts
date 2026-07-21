import { AsyncApiDocument, ListMessagesOutput, MessageSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, detectVersion, listMessageEntries } from './lib';

/**
 * Lists every message DEFINITION found in the document: every named entry
 * under `components.messages` (the canonical, addressable collection —
 * use GetMessagePayload to look one up by name), plus any inline (not a
 * $ref) message object found directly under a channel's publish/
 * subscribe/messages that isn't already covered by components. Each entry
 * reports its resolved name, title, summary, description, contentType,
 * whether it declares a payload/headers schema, and where it was found
 * ("components.messages" or a channel-relative path for an inline
 * definition).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listMessages(ax: AxiomContext, input: AsyncApiDocument): ListMessagesOutput {
  const out = new ListMessagesOutput();
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

  const messages = listMessageEntries(doc, majorVersion).map((m) => {
    const s = new MessageSummary();
    s.setName(m.name);
    s.setTitle(m.title);
    s.setSummary(m.summary);
    s.setDescription(m.description);
    s.setContentType(m.contentType);
    s.setHasPayload(m.hasPayload);
    s.setHasHeaders(m.hasHeaders);
    s.setSource(m.source);
    return s;
  });
  out.setMessagesList(messages);
  return out;
}
