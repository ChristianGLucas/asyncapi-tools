import { AsyncApiDocument } from '../gen/messages_pb';
import { extractOperationBindings } from './extract_operation_bindings';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ExtractOperationBindings', () => {
  it('extracts 2.x operation bindings keyed by operationId', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractOperationBindings(ctx, input);
    const rows = result.getBindingsList();
    expect(rows.map((r) => r.getScopeName())).toEqual(['receiveLightMeasurement', 'turnOn']);
    expect(JSON.parse(rows[0].getBindingsJson())).toEqual({ groupId: 'light-measured-group', clientId: 'light-measured-client' });
    expect(JSON.parse(rows[1].getBindingsJson())).toEqual({ key: { type: 'string' } });
  });

  it('falls back to "<channel>.<action>" scope_name when a 2.x operation has no operationId', () => {
    const doc = `
asyncapi: '2.6.0'
info:
  title: X
  version: '1.0.0'
channels:
  foo:
    publish:
      bindings:
        kafka:
          key:
            type: string
`;
    const input = new AsyncApiDocument();
    input.setContent(doc);
    const result = extractOperationBindings(ctx, input);
    const rows = result.getBindingsList();
    expect(rows).toHaveLength(1);
    expect(rows[0].getScopeName()).toBe('foo.publish');
  });

  it('extracts 3.x operation bindings keyed by the top-level operation key', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = extractOperationBindings(ctx, input);
    const rows = result.getBindingsList();
    expect(rows).toHaveLength(1);
    expect(rows[0].getScopeName()).toBe('onLightMeasured');
    expect(JSON.parse(rows[0].getBindingsJson())).toEqual({ groupId: 'light-measured-group' });
  });

  it('returns an empty list when no operation declares bindings', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '3.0.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = extractOperationBindings(ctx, input);
    expect(result.getBindingsList()).toHaveLength(0);
  });
});
