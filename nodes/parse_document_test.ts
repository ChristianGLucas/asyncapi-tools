import { AsyncApiDocument } from '../gen/messages_pb';
import { parseDocument } from './parse_document';
import { ctx, FIXTURE_V2, FIXTURE_V3, NOT_A_MAPPING_DOC, UNPARSEABLE_YAML } from './testkit';

describe('ParseDocument', () => {
  it('parses a 2.x document top-level overview (no top-level operations section)', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = parseDocument(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getMajorVersion()).toBe(2);
    expect(result.getVersionString()).toBe('2.6.0');
    expect(result.getTitle()).toBe('Streetlights API');
    expect(result.getApiVersion()).toBe('1.0.0');
    expect(result.getServerCount()).toBe(2);
    expect(result.getChannelCount()).toBe(3);
    expect(result.getTopLevelOperationCount()).toBe(0);
    expect(result.getHasComponents()).toBe(true);
  });

  it('parses a 3.x document top-level overview including top-level operations', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = parseDocument(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getMajorVersion()).toBe(3);
    expect(result.getVersionString()).toBe('3.0.0');
    expect(result.getTitle()).toBe('Streetlights API v3');
    expect(result.getApiVersion()).toBe('2.0.0');
    expect(result.getServerCount()).toBe(2);
    expect(result.getChannelCount()).toBe(3);
    expect(result.getTopLevelOperationCount()).toBe(3);
    expect(result.getHasComponents()).toBe(true);
  });

  it('reports has_components=false and zero counts for a components-less minimal document', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: Bare\n  version: '1.0.0'\nchannels: {}\n");
    const result = parseDocument(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getHasComponents()).toBe(false);
    expect(result.getChannelCount()).toBe(0);
    expect(result.getServerCount()).toBe(0);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new AsyncApiDocument();
    input.setContent(NOT_A_MAPPING_DOC);
    const result = parseDocument(ctx, input);
    expect(result.getError()).not.toBe('');
  });

  it('returns a structured error for unparseable YAML, never a crash', () => {
    const input = new AsyncApiDocument();
    input.setContent(UNPARSEABLE_YAML);
    const result = parseDocument(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
