import { AsyncApiDocument } from '../gen/messages_pb';
import { listOperations } from './list_operations';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ListOperations', () => {
  it('flattens 2.x channel publish/subscribe blocks into one operation each', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = listOperations(ctx, input);
    expect(result.getMajorVersion()).toBe(2);
    const ops = result.getOperationsList();
    expect(ops).toHaveLength(3);

    const receive = ops.find((o) => o.getOperationId() === 'receiveLightMeasurement')!;
    expect(receive.getAction()).toBe('subscribe');
    expect(receive.getChannel()).toBe('light/measured');
    expect(receive.getMessageNamesList()).toEqual(['lightMeasured']);
    expect(receive.getDescription()).toBe('Receives light measurement events.');

    const turnOn = ops.find((o) => o.getOperationId() === 'turnOn')!;
    expect(turnOn.getAction()).toBe('publish');
    expect(turnOn.getChannel()).toBe('light/turn/on');
    expect(turnOn.getMessageNamesList()).toEqual(['turnOnOff']);
  });

  it('lists 3.x top-level operations with resolved channel and message names', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = listOperations(ctx, input);
    expect(result.getMajorVersion()).toBe(3);
    const ops = result.getOperationsList();
    expect(ops.map((o) => o.getOperationId())).toEqual(['onLightMeasured', 'turnOnOperation', 'publishInlineStatus']);

    const onMeasured = ops[0];
    expect(onMeasured.getAction()).toBe('receive');
    expect(onMeasured.getChannel()).toBe('lightMeasured');
    expect(onMeasured.getMessageNamesList()).toEqual(['lightMeasured']);
    expect(onMeasured.getSummary()).toBe('Inform about environmental lighting conditions.');

    const turnOnOp = ops[1];
    expect(turnOnOp.getAction()).toBe('send');
    expect(turnOnOp.getChannel()).toBe('turnOn');
    expect(turnOnOp.getMessageNamesList()).toEqual(['turnOnOff']);
  });

  it('returns an empty operations list for a document with no channels/operations', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '3.0.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = listOperations(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getOperationsList()).toHaveLength(0);
  });
});
