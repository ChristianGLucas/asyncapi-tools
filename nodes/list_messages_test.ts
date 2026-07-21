import { AsyncApiDocument } from '../gen/messages_pb';
import { listMessages } from './list_messages';
import { ctx, FIXTURE_V2, FIXTURE_V3, ORACLE_V2_MESSAGE_NAMES, ORACLE_V3_MESSAGE_NAMES } from './testkit';

describe('ListMessages', () => {
  it('lists 2.x messages from components.messages plus an inline channel message', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = listMessages(ctx, input);
    const messages = result.getMessagesList();
    expect(messages.map((m) => m.getName())).toEqual(ORACLE_V2_MESSAGE_NAMES);

    const lightMeasured = messages.find((m) => m.getName() === 'lightMeasured')!;
    expect(lightMeasured.getSource()).toBe('components.messages');
    expect(lightMeasured.getContentType()).toBe('application/json');
    expect(lightMeasured.getHasPayload()).toBe(true);
    expect(lightMeasured.getHasHeaders()).toBe(true);
    expect(lightMeasured.getTitle()).toBe('Light measured');

    const turnOnOff = messages.find((m) => m.getName() === 'turnOnOff')!;
    expect(turnOnOff.getHasHeaders()).toBe(false);

    const inline = messages.find((m) => m.getName() === 'inlineStatus')!;
    expect(inline.getSource()).toBe('channels.light/inline/status.publish.message');
    expect(inline.getTitle()).toBe('Inline Status');
    expect(inline.getHasPayload()).toBe(true);
  });

  it('lists 3.x messages from components.messages plus an inline channel message', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = listMessages(ctx, input);
    const messages = result.getMessagesList();
    expect(messages.map((m) => m.getName())).toEqual(ORACLE_V3_MESSAGE_NAMES);

    const inline = messages.find((m) => m.getName() === 'inlineStatus3')!;
    expect(inline.getSource()).toBe('channels.inlineStatus.messages.inlineStatusMessage');
    expect(inline.getTitle()).toBe('Inline Status v3');
  });

  it('does not double-count a components message referenced by a channel $ref', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = listMessages(ctx, input);
    const names = result.getMessagesList().map((m) => m.getName());
    expect(names.filter((n) => n === 'lightMeasured')).toHaveLength(1);
  });

  it('returns an empty list for a document with no messages anywhere', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = listMessages(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getMessagesList()).toHaveLength(0);
  });
});
