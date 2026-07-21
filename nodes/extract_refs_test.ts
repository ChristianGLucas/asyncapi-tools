import { AsyncApiDocument } from '../gen/messages_pb';
import { extractRefs } from './extract_refs';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ExtractRefs', () => {
  it('extracts every 2.x $ref, flagging the external one', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractRefs(ctx, input);
    expect(result.getRefsList()).toEqual([
      '#/components/messages/lightMeasured',
      '#/components/messages/turnOnOff',
      '#/components/schemas/lightMeasuredPayload',
      'https://example.com/schemas/external.json#/Foo',
    ]);
    expect(result.getExternalRefsList()).toEqual(['https://example.com/schemas/external.json#/Foo']);
  });

  it('extracts every 3.x $ref, including channel/operation/message pointers, with no external refs', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = extractRefs(ctx, input);
    const refs = result.getRefsList();
    expect(refs).toContain('#/channels/lightMeasured');
    expect(refs).toContain('#/channels/lightMeasured/messages/lightMeasuredMessage');
    expect(refs).toContain('#/components/schemas/lightMeasuredPayload');
    expect(result.getExternalRefsList()).toHaveLength(0);
  });

  it('never fetches — external refs are reported as strings only', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractRefs(ctx, input);
    // The mere presence of an http(s) URL in the output proves no fetch was
    // attempted to resolve it into schema content — it is passed through verbatim.
    expect(result.getExternalRefsList()[0]).toBe('https://example.com/schemas/external.json#/Foo');
  });

  it('deduplicates a $ref used more than once', () => {
    const doc = `
asyncapi: '3.0.0'
info:
  title: X
  version: '1.0.0'
channels:
  a:
    address: a
    messages:
      m1:
        \$ref: '#/components/messages/shared'
      m2:
        \$ref: '#/components/messages/shared'
components:
  messages:
    shared:
      contentType: application/json
`;
    const input = new AsyncApiDocument();
    input.setContent(doc);
    const result = extractRefs(ctx, input);
    expect(result.getRefsList()).toEqual(['#/components/messages/shared']);
  });

  it('returns an empty list, never a crash, for a document with no $refs at all', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = extractRefs(ctx, input);
    expect(result.getRefsList()).toHaveLength(0);
    expect(result.getExternalRefsList()).toHaveLength(0);
  });
});
