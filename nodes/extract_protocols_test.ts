import { AsyncApiDocument } from '../gen/messages_pb';
import { extractProtocols } from './extract_protocols';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ExtractProtocols', () => {
  it('inventories 2.x protocols across servers, sorted, with counts', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractProtocols(ctx, input);
    const protocols = result.getProtocolsList().map((p) => [p.getProtocol(), p.getServerCount()]);
    expect(protocols).toEqual([
      ['kafka', 1],
      ['mqtt', 1],
    ]);
  });

  it('inventories 3.x protocols across servers', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = extractProtocols(ctx, input);
    const protocols = result.getProtocolsList().map((p) => [p.getProtocol(), p.getServerCount()]);
    expect(protocols).toEqual([
      ['kafka', 1],
      ['ws', 1],
    ]);
  });

  it('tallies multiple servers on the same protocol into one entry', () => {
    const doc = `
asyncapi: '2.6.0'
info:
  title: X
  version: '1.0.0'
servers:
  a:
    url: a.example.com
    protocol: kafka
  b:
    url: b.example.com
    protocol: kafka
  c:
    url: c.example.com
    protocol: amqp
channels: {}
`;
    const input = new AsyncApiDocument();
    input.setContent(doc);
    const result = extractProtocols(ctx, input);
    const protocols = result.getProtocolsList().map((p) => [p.getProtocol(), p.getServerCount()]);
    expect(protocols).toEqual([
      ['amqp', 1],
      ['kafka', 2],
    ]);
  });

  it('returns an empty list when there are no servers', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = extractProtocols(ctx, input);
    expect(result.getProtocolsList()).toHaveLength(0);
  });
});
