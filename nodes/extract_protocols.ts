import { AsyncApiDocument, ExtractProtocolsOutput, ProtocolCount } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, listServerEntries } from './lib';

/**
 * Extracts a transport-protocol inventory: every distinct `protocol:`
 * value declared across the document's servers, with how many servers
 * declare it (e.g. two servers on "kafka" and one on "mqtt"). Servers
 * with an empty/missing protocol are not counted. Sorted by protocol name
 * for deterministic output order.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractProtocols(ax: AxiomContext, input: AsyncApiDocument): ExtractProtocolsOutput {
  const out = new ExtractProtocolsOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const counts = new Map<string, number>();
  for (const s of listServerEntries(data)) {
    if (s.protocol === '') continue;
    counts.set(s.protocol, (counts.get(s.protocol) ?? 0) + 1);
  }
  const protocols = Array.from(counts.keys())
    .sort()
    .map((protocol) => {
      const p = new ProtocolCount();
      p.setProtocol(protocol);
      p.setServerCount(counts.get(protocol) ?? 0);
      return p;
    });
  out.setProtocolsList(protocols);
  return out;
}
