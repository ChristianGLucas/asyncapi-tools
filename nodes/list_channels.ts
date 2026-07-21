import { AsyncApiDocument, ListChannelsOutput, ChannelSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, detectVersion, listChannelEntries } from './lib';

/**
 * Lists every channel in the document, unified across spec generations:
 * for a 2.x document, each channel's key plus whether it declares a
 * `publish:`/`subscribe:` operation and that operation's resolved
 * message name(s); for a 3.x document, each channel's key, its `address:`
 * (defaulting to the key when address is omitted), and the resolved
 * message name(s) under its `messages:` map. Also includes each channel's
 * `description` and declared `parameters:` names (used for templated
 * channel addresses like "user/{userId}/signedup").
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listChannels(ax: AxiomContext, input: AsyncApiDocument): ListChannelsOutput {
  const out = new ListChannelsOutput();
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

  const channels = listChannelEntries(doc, majorVersion).map((c) => {
    const s = new ChannelSummary();
    s.setName(c.name);
    s.setAddress(c.address);
    s.setDescription(c.description);
    s.setMessageNamesList(c.messageNames);
    s.setHasPublish(c.hasPublish);
    s.setHasSubscribe(c.hasSubscribe);
    s.setParameterNamesList(c.parameterNames);
    return s;
  });
  out.setChannelsList(channels);
  return out;
}
