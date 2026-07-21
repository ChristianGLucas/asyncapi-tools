import { AsyncApiDocument } from '../gen/messages_pb';
import { extractMessageSchemas } from './extract_message_schemas';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ExtractMessageSchemas', () => {
  it('resolves an internal $ref payload for a 2.x message', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractMessageSchemas(ctx, input);
    const rows = result.getSchemasList();
    const lightMeasured = rows.find((r) => r.getMessageName() === 'lightMeasured')!;
    expect(lightMeasured.getPayloadIsRef()).toBe(true);
    expect(lightMeasured.getPayloadRef()).toBe('#/components/schemas/lightMeasuredPayload');
    expect(lightMeasured.getRefIsExternal()).toBe(false);
    expect(JSON.parse(lightMeasured.getResolvedSchemaJson())).toEqual({
      type: 'object',
      properties: { lumens: { type: 'integer', minimum: 0 }, sentAt: { type: 'string', format: 'date-time' } },
    });
  });

  it('reports an inline (non-ref) payload verbatim', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractMessageSchemas(ctx, input);
    const turnOnOff = result.getSchemasList().find((r) => r.getMessageName() === 'turnOnOff')!;
    expect(turnOnOff.getPayloadIsRef()).toBe(false);
    expect(turnOnOff.getPayloadRef()).toBe('');
    expect(JSON.parse(turnOnOff.getResolvedSchemaJson())).toMatchObject({ type: 'object' });
  });

  it('flags an external payload $ref as unresolved rather than fetching it', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractMessageSchemas(ctx, input);
    const ext = result.getSchemasList().find((r) => r.getMessageName() === 'externalPayloadMessage')!;
    expect(ext.getPayloadIsRef()).toBe(true);
    expect(ext.getRefIsExternal()).toBe(true);
    expect(ext.getPayloadRef()).toBe('https://example.com/schemas/external.json#/Foo');
    expect(ext.getResolvedSchemaJson()).toBe('{}');
  });

  it('resolves an internal $ref payload for a 3.x message the same way', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = extractMessageSchemas(ctx, input);
    const lightMeasured = result.getSchemasList().find((r) => r.getMessageName() === 'lightMeasured')!;
    expect(lightMeasured.getPayloadIsRef()).toBe(true);
    expect(lightMeasured.getRefIsExternal()).toBe(false);
    expect(JSON.parse(lightMeasured.getResolvedSchemaJson())).toEqual({
      type: 'object',
      properties: { lumens: { type: 'integer', minimum: 0 } },
    });
  });

  it('covers every message in the document (row count matches ListMessages)', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractMessageSchemas(ctx, input);
    expect(result.getSchemasList()).toHaveLength(4);
  });
});
