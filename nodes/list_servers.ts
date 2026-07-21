import { AsyncApiDocument, ListServersOutput, ServerSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, listServerEntries } from './lib';

/**
 * Lists every server declared under the document's top-level `servers:`
 * map: name, protocol, protocolVersion, description, and a `url` field
 * normalized across spec generations (2.x's `url:` verbatim, or 3.x's
 * `host:` + `pathname:` concatenated) — plus the raw 3.x `host`/`pathname`
 * split for callers that need it (both empty for a 2.x document).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listServers(ax: AxiomContext, input: AsyncApiDocument): ListServersOutput {
  const out = new ListServersOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const servers = listServerEntries(data).map((s) => {
    const out2 = new ServerSummary();
    out2.setName(s.name);
    out2.setUrl(s.url);
    out2.setHost(s.host);
    out2.setPathname(s.pathname);
    out2.setProtocol(s.protocol);
    out2.setProtocolVersion(s.protocolVersion);
    out2.setDescription(s.description);
    return out2;
  });
  out.setServersList(servers);
  return out;
}
