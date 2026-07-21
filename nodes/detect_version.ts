import { AsyncApiDocument, DetectVersionOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, detectVersion as detectVersionOf } from './lib';

/**
 * Detects which AsyncAPI spec generation a document declares by reading its
 * top-level `asyncapi:` field — 2 for any "2.x.x" document, 3 for any
 * "3.x.x" document, or 0 if the field is missing, empty, or not a
 * recognized "N.x.x" version string. AsyncAPI 2.x and 3.x have materially
 * different document shapes (2.x nests publish/subscribe operations inside
 * each channel; 3.x hoists operations to a top-level `operations:` map
 * that references channels by $ref), so every other node in this package
 * branches its extraction logic on this result.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectVersion(ax: AxiomContext, input: AsyncApiDocument): DetectVersionOutput {
  const out = new DetectVersionOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setParseError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setParseError('document is not a mapping');
    return out;
  }
  const { majorVersion, versionString } = detectVersionOf(data);
  out.setMajorVersion(majorVersion);
  out.setVersionString(versionString);
  return out;
}
