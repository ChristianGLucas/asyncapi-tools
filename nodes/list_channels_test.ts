import { AsyncApiDocument } from '../gen/messages_pb';
import { listChannels } from './list_channels';
import { ctx, FIXTURE_V2, FIXTURE_V3, ORACLE_V2_CHANNEL_NAMES, ORACLE_V3_CHANNEL_NAMES } from './testkit';

describe('ListChannels', () => {
  it('lists 2.x channels with publish/subscribe flags, resolved message names, and parameters', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = listChannels(ctx, input);
    expect(result.getMajorVersion()).toBe(2);
    const channels = result.getChannelsList();
    expect(channels.map((c) => c.getName())).toEqual(ORACLE_V2_CHANNEL_NAMES);

    const measured = channels[0];
    expect(measured.getAddress()).toBe(''); // 2.x has no address field
    expect(measured.getHasSubscribe()).toBe(true);
    expect(measured.getHasPublish()).toBe(false);
    expect(measured.getMessageNamesList()).toEqual(['lightMeasured']);
    expect(measured.getParameterNamesList()).toEqual(['streetlightId']);

    const turnOn = channels[1];
    expect(turnOn.getHasPublish()).toBe(true);
    expect(turnOn.getHasSubscribe()).toBe(false);
    expect(turnOn.getMessageNamesList()).toEqual(['turnOnOff']);

    const inline = channels[2];
    expect(inline.getMessageNamesList()).toEqual(['inlineStatus']);
  });

  it('lists 3.x channels with resolved address and message names', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = listChannels(ctx, input);
    expect(result.getMajorVersion()).toBe(3);
    const channels = result.getChannelsList();
    expect(channels.map((c) => c.getName())).toEqual(ORACLE_V3_CHANNEL_NAMES);

    const measured = channels[0];
    expect(measured.getAddress()).toBe('light/measured');
    expect(measured.getMessageNamesList()).toEqual(['lightMeasured']);
    expect(measured.getParameterNamesList()).toEqual(['streetlightId']);
    expect(measured.getHasPublish()).toBe(false); // not applicable to 3.x
    expect(measured.getHasSubscribe()).toBe(false);

    const inline = channels[2];
    expect(inline.getMessageNamesList()).toEqual(['inlineStatus3']);
  });

  it('defaults a 3.x channel address to its key when address: is omitted', () => {
    const doc = `
asyncapi: '3.0.0'
info:
  title: X
  version: '1.0.0'
channels:
  noAddressChannel:
    description: no address declared
`;
    const input = new AsyncApiDocument();
    input.setContent(doc);
    const result = listChannels(ctx, input);
    const channels = result.getChannelsList();
    expect(channels).toHaveLength(1);
    expect(channels[0].getName()).toBe('noAddressChannel');
    expect(channels[0].getAddress()).toBe('noAddressChannel');
  });

  it('returns an empty list, never a crash, when channels: is absent', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\n");
    const result = listChannels(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getChannelsList()).toHaveLength(0);
  });
});
