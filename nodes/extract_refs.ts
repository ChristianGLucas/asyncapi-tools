import { AsyncApiDocument, ExtractRefsOutput } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, collectAllRefs, isInternalRef } from './lib';

/**
 * Extracts every `$ref` string found anywhere in the document, in
 * first-seen order, deduplicated — plus the subset that are external (do
 * not start with "#/": a remote URL or filesystem path, as opposed to a
 * same-document JSON pointer). This is a report only: no $ref, internal
 * or external, is ever fetched or resolved here (several other nodes —
 * ListChannels, ListOperations, GetMessagePayload,
 * ExtractMessageSchemas — resolve INTERNAL refs for their own output
 * fields; this node exists purely to inventory ref usage across the whole
 * document).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractRefs(ax: AxiomContext, input: AsyncApiDocument): ExtractRefsOutput {
  const out = new ExtractRefsOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setError(parseError);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setError('document is not a mapping');
    return out;
  }
  const refs = collectAllRefs(data);
  out.setRefsList(refs);
  out.setExternalRefsList(refs.filter((r) => !isInternalRef(r)));
  return out;
}
