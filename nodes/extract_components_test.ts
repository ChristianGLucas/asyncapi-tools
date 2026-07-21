import { AsyncApiDocument } from '../gen/messages_pb';
import { extractComponents } from './extract_components';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ExtractComponents', () => {
  it('indexes 2.x components (no channel/operation/server reusable sections)', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractComponents(ctx, input);
    expect(result.getMessageNamesList()).toEqual(['lightMeasured', 'turnOnOff', 'externalPayloadMessage']);
    expect(result.getSchemaNamesList()).toEqual(['lightMeasuredPayload']);
    expect(result.getSecuritySchemeNamesList()).toEqual(['apiKey', 'httpApiKey', 'bearerAuth', 'oauth2']);
    expect(result.getParameterNamesList()).toEqual(['streetlightId']);
    expect(result.getChannelNamesList()).toEqual([]);
    expect(result.getOperationNamesList()).toEqual([]);
    expect(result.getServerNamesList()).toEqual([]);
  });

  it('indexes 3.x components including reusable channels/operations/servers', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = extractComponents(ctx, input);
    expect(result.getMessageNamesList()).toEqual(['lightMeasured', 'turnOnOff']);
    expect(result.getSchemaNamesList()).toEqual(['lightMeasuredPayload']);
    expect(result.getSecuritySchemeNamesList()).toEqual(['apiKey', 'bearerAuth']);
    expect(result.getParameterNamesList()).toEqual(['streetlightId']);
    expect(result.getChannelNamesList()).toEqual(['reusableChannel']);
    expect(result.getOperationNamesList()).toEqual(['reusableOperation']);
    expect(result.getServerNamesList()).toEqual(['reusableServer']);
  });

  it('returns empty lists, never a crash, for a document with no components: section', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = extractComponents(ctx, input);
    expect(result.getMessageNamesList()).toHaveLength(0);
    expect(result.getSchemaNamesList()).toHaveLength(0);
    expect(result.getError()).toBe('');
  });
});
