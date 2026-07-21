import { AsyncApiDocument, ExtractInfoOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, extractInfo as extractInfoOf } from './lib';

/**
 * Extracts the document's `info` block — title, version, description,
 * terms of service, contact (name/url/email), license (name/url), tags,
 * and external-docs URL. This shape is identical between AsyncAPI 2.x and
 * 3.x. `found` is false (with every other field empty) when the document
 * has no `info:` mapping at all.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractInfo(ax: AxiomContext, input: AsyncApiDocument): ExtractInfoOutput {
  const out = new ExtractInfoOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const info = extractInfoOf(data);
  out.setFound(info.found);
  out.setTitle(info.title);
  out.setApiVersion(info.apiVersion);
  out.setDescription(info.description);
  out.setTermsOfService(info.termsOfService);
  out.setContactName(info.contactName);
  out.setContactUrl(info.contactUrl);
  out.setContactEmail(info.contactEmail);
  out.setLicenseName(info.licenseName);
  out.setLicenseUrl(info.licenseUrl);
  out.setTagsList(info.tags);
  out.setExternalDocsUrl(info.externalDocsUrl);
  if (!info.found) out.setError('document has no info block');
  return out;
}
