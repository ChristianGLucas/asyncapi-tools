import { AsyncApiDocument, ExtractComponentsOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, componentsOf, namedKeys } from './lib';

/**
 * Lists the named entries under the document's `components:` section — an
 * index of what's available for lookup by the other Get and List nodes,
 * without resolving or expanding any of it: message, schema, security-
 * scheme, and parameter names (both spec generations), plus (3.x only)
 * reusable channel, operation, and server names under
 * components.channels/operations/servers (always empty for a 2.x
 * document, which has no such sections).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractComponents(ax: AxiomContext, input: AsyncApiDocument): ExtractComponentsOutput {
  const out = new ExtractComponentsOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const components = componentsOf(data);
  out.setMessageNamesList(namedKeys(components, 'messages'));
  out.setSchemaNamesList(namedKeys(components, 'schemas'));
  out.setSecuritySchemeNamesList(namedKeys(components, 'securitySchemes'));
  out.setParameterNamesList(namedKeys(components, 'parameters'));
  out.setChannelNamesList(namedKeys(components, 'channels'));
  out.setOperationNamesList(namedKeys(components, 'operations'));
  out.setServerNamesList(namedKeys(components, 'servers'));
  return out;
}
