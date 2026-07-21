import { AsyncApiDocument, ParseDocumentOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parseDocument as parseDoc,
  looksLikeDocument,
  detectVersion,
  extractInfo,
  componentsOf,
  isPlainObject,
} from './lib';

/**
 * Parses an AsyncAPI document (2.x or 3.x, YAML or JSON text) into a brief
 * top-level structural overview: detected spec generation, the `info`
 * block's title and version, and counts of servers/channels and (for a
 * 3.x document only — 2.x has no top-level operations section) top-level
 * operations. For full detail on any one section, use the dedicated
 * dedicated List/Extract nodes instead; for a document-wide count including 2.x
 * operations, use SummarizeDocument.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseDocument(ax: AxiomContext, input: AsyncApiDocument): ParseDocumentOutput {
  const out = new ParseDocumentOutput();
  const { data, parseError } = parseDoc(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const doc = data as Record<string, unknown>;
  const { majorVersion, versionString } = detectVersion(doc);
  out.setMajorVersion(majorVersion);
  out.setVersionString(versionString);

  const info = extractInfo(doc);
  out.setTitle(info.title);
  out.setApiVersion(info.apiVersion);

  const servers = isPlainObject(doc.servers) ? doc.servers : {};
  out.setServerCount(Object.keys(servers).length);
  const channels = isPlainObject(doc.channels) ? doc.channels : {};
  out.setChannelCount(Object.keys(channels).length);
  const operations = isPlainObject(doc.operations) ? doc.operations : {};
  out.setTopLevelOperationCount(Object.keys(operations).length);

  const components = componentsOf(doc);
  out.setHasComponents(Object.keys(components).length > 0);
  return out;
}
