import { MessageRequest } from '../gen/messages_pb';
import { getMessagePayload } from './get_message_payload';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('GetMessagePayload', () => {
  it('returns a 2.x message payload/headers/contentType, leaving an internal $ref unresolved', () => {
    const input = new MessageRequest();
    input.setContent(FIXTURE_V2);
    input.setMessageName('lightMeasured');
    const result = getMessagePayload(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getContentType()).toBe('application/json');
    expect(JSON.parse(result.getPayloadJson())).toEqual({ $ref: '#/components/schemas/lightMeasuredPayload' });
    expect(JSON.parse(result.getHeadersJson())).toEqual({
      type: 'object',
      properties: { 'my-app-header': { type: 'integer', minimum: 0, maximum: 100 } },
    });
  });

  it("returns '{}' for headers_json when a message declares no headers", () => {
    const input = new MessageRequest();
    input.setContent(FIXTURE_V2);
    input.setMessageName('turnOnOff');
    const result = getMessagePayload(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(JSON.parse(result.getHeadersJson())).toEqual({});
    expect(JSON.parse(result.getPayloadJson())).toMatchObject({ type: 'object' });
  });

  it('resolves an inline (non-components) message by its declared name for a 2.x document', () => {
    const input = new MessageRequest();
    input.setContent(FIXTURE_V2);
    input.setMessageName('inlineStatus');
    const result = getMessagePayload(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(JSON.parse(result.getPayloadJson())).toEqual({
      type: 'object',
      properties: { status: { type: 'string' } },
    });
  });

  it('resolves a 3.x message the same way', () => {
    const input = new MessageRequest();
    input.setContent(FIXTURE_V3);
    input.setMessageName('lightMeasured');
    const result = getMessagePayload(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(JSON.parse(result.getPayloadJson())).toEqual({ $ref: '#/components/schemas/lightMeasuredPayload' });
  });

  it('returns found=false and an error for a message name that does not exist', () => {
    const input = new MessageRequest();
    input.setContent(FIXTURE_V2);
    input.setMessageName('doesNotExist');
    const result = getMessagePayload(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).not.toBe('');
    expect(result.getPayloadJson()).toBe('');
  });

  it('returns a structured error when message_name is empty', () => {
    const input = new MessageRequest();
    input.setContent(FIXTURE_V2);
    input.setMessageName('');
    const result = getMessagePayload(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toMatch(/message_name is required/);
  });
});
