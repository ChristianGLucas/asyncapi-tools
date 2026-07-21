import { AsyncApiDocument, SummarizeDocumentOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parseDocument,
  looksLikeDocument,
  detectVersion,
  isPlainObject,
  listOperationEntries,
  listMessageEntries,
  componentsOf,
  namedKeys,
} from './lib';

/**
 * Whole-document counts — the cheapest possible "what's in here" check:
 * server, channel, operation, message, schema, and security-scheme
 * counts. operation_count is version-normalized: for a 2.x document it is
 * the sum of every channel's publish/subscribe operations (2.x has no
 * top-level operations section); for a 3.x document it is the size of the
 * top-level `operations:` map.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function summarizeDocument(ax: AxiomContext, input: AsyncApiDocument): SummarizeDocumentOutput {
  const out = new SummarizeDocumentOutput();
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
  const { majorVersion, versionString } = detectVersion(doc);
  out.setMajorVersion(majorVersion);
  out.setVersionString(versionString);

  const servers = isPlainObject(doc.servers) ? doc.servers : {};
  out.setServerCount(Object.keys(servers).length);
  const channels = isPlainObject(doc.channels) ? doc.channels : {};
  out.setChannelCount(Object.keys(channels).length);
  out.setOperationCount(listOperationEntries(doc, majorVersion).length);
  out.setMessageCount(listMessageEntries(doc, majorVersion).length);

  const components = componentsOf(doc);
  out.setSchemaCount(namedKeys(components, 'schemas').length);
  out.setSecuritySchemeCount(namedKeys(components, 'securitySchemes').length);
  return out;
}
