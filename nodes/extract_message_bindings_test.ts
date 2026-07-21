import { AsyncApiDocument } from '../gen/messages_pb';
import { extractMessageBindings } from './extract_message_bindings';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ExtractMessageBindings', () => {
  it('extracts 2.x message bindings from components.messages', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractMessageBindings(ctx, input);
    const rows = result.getBindingsList();
    expect(rows).toHaveLength(1);
    expect(rows[0].getScopeName()).toBe('lightMeasured');
    expect(rows[0].getProtocol()).toBe('kafka');
    expect(JSON.parse(rows[0].getBindingsJson())).toEqual({ key: { type: 'string' } });
  });

  it('extracts 3.x message bindings the same way', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = extractMessageBindings(ctx, input);
    const rows = result.getBindingsList();
    expect(rows).toHaveLength(1);
    expect(rows[0].getScopeName()).toBe('lightMeasured');
  });

  it('returns an empty list when no message declares bindings', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\ncomponents:\n  messages:\n    m:\n      contentType: application/json\n");
    const result = extractMessageBindings(ctx, input);
    expect(result.getBindingsList()).toHaveLength(0);
  });
});
