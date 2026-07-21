import { AsyncApiDocument } from '../gen/messages_pb';
import { extractServerBindings } from './extract_server_bindings';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ExtractServerBindings', () => {
  it('extracts the 2.x production server kafka bindings, none for staging (no bindings declared)', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractServerBindings(ctx, input);
    const rows = result.getBindingsList();
    expect(rows).toHaveLength(1);
    expect(rows[0].getScopeName()).toBe('production');
    expect(rows[0].getProtocol()).toBe('kafka');
    expect(JSON.parse(rows[0].getBindingsJson())).toEqual({
      schemaRegistryUrl: 'https://schema-registry.example.com',
      schemaRegistryVendor: 'confluent',
    });
  });

  it('extracts 3.x server bindings the same way', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = extractServerBindings(ctx, input);
    const rows = result.getBindingsList();
    expect(rows).toHaveLength(1);
    expect(rows[0].getScopeName()).toBe('production');
    expect(JSON.parse(rows[0].getBindingsJson())).toEqual({ schemaRegistryUrl: 'https://schema-registry.example.com' });
  });

  it('returns an empty list when no server declares bindings', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nservers:\n  a:\n    url: a.example.com\n    protocol: kafka\nchannels: {}\n");
    const result = extractServerBindings(ctx, input);
    expect(result.getBindingsList()).toHaveLength(0);
  });
});
