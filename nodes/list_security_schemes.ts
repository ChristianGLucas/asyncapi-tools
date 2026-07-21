import { AsyncApiDocument, ListSecuritySchemesOutput, SecuritySchemeInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, listSecuritySchemeEntries } from './lib';

/**
 * Lists every security scheme declared under `components.securitySchemes`:
 * name, type ("userPassword", "apiKey", "X509", "symmetricEncryption",
 * "asymmetricEncryption", "httpApiKey", "http", "oauth2",
 * "openIdConnect", "plain", "scramSha256", "scramSha512", "gssapi"), plus
 * whichever type-specific fields apply (http's scheme/bearerFormat,
 * apiKey/httpApiKey's location+name, oauth2's flows object as JSON,
 * openIdConnect's URL). This shape is identical between AsyncAPI 2.x and
 * 3.x.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listSecuritySchemes(ax: AxiomContext, input: AsyncApiDocument): ListSecuritySchemesOutput {
  const out = new ListSecuritySchemesOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const schemes = listSecuritySchemeEntries(data as Record<string, unknown>).map((s) => {
    const info = new SecuritySchemeInfo();
    info.setName(s.name);
    info.setType(s.type);
    info.setScheme(s.scheme);
    info.setBearerFormat(s.bearerFormat);
    info.setApiKeyIn(s.apiKeyIn);
    info.setApiKeyName(s.apiKeyName);
    info.setOauthFlowsJson(s.oauthFlowsJson);
    info.setOpenIdConnectUrl(s.openIdConnectUrl);
    info.setDescription(s.description);
    return info;
  });
  out.setSchemesList(schemes);
  return out;
}
