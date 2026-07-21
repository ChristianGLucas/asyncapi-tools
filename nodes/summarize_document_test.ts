import { AsyncApiDocument } from '../gen/messages_pb';
import { summarizeDocument } from './summarize_document';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('SummarizeDocument', () => {
  it('summarizes a 2.x document, counting publish+subscribe as operations', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = summarizeDocument(ctx, input);
    expect(result.getMajorVersion()).toBe(2);
    expect(result.getVersionString()).toBe('2.6.0');
    expect(result.getServerCount()).toBe(2);
    expect(result.getChannelCount()).toBe(3);
    expect(result.getOperationCount()).toBe(3);
    expect(result.getMessageCount()).toBe(4);
    expect(result.getSchemaCount()).toBe(1);
    expect(result.getSecuritySchemeCount()).toBe(4);
  });

  it('summarizes a 3.x document, counting top-level operations', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = summarizeDocument(ctx, input);
    expect(result.getMajorVersion()).toBe(3);
    expect(result.getVersionString()).toBe('3.0.0');
    expect(result.getServerCount()).toBe(2);
    expect(result.getChannelCount()).toBe(3);
    expect(result.getOperationCount()).toBe(3);
    expect(result.getMessageCount()).toBe(3);
    expect(result.getSchemaCount()).toBe(1);
    expect(result.getSecuritySchemeCount()).toBe(2);
  });

  it('returns all-zero counts for an empty-but-valid minimal document', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = summarizeDocument(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getServerCount()).toBe(0);
    expect(result.getChannelCount()).toBe(0);
    expect(result.getOperationCount()).toBe(0);
    expect(result.getMessageCount()).toBe(0);
  });
});
