import { AsyncApiDocument } from '../gen/messages_pb';
import { listSecuritySchemes } from './list_security_schemes';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ListSecuritySchemes', () => {
  it('extracts all four 2.x security-scheme types with their type-specific fields', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = listSecuritySchemes(ctx, input);
    const schemes = result.getSchemesList();
    expect(schemes.map((s) => s.getName())).toEqual(['apiKey', 'httpApiKey', 'bearerAuth', 'oauth2']);

    const apiKey = schemes[0];
    expect(apiKey.getType()).toBe('apiKey');
    expect(apiKey.getApiKeyIn()).toBe('user');

    const httpApiKey = schemes[1];
    expect(httpApiKey.getType()).toBe('httpApiKey');
    expect(httpApiKey.getApiKeyIn()).toBe('header');
    expect(httpApiKey.getApiKeyName()).toBe('api_key');

    const bearer = schemes[2];
    expect(bearer.getType()).toBe('http');
    expect(bearer.getScheme()).toBe('bearer');
    expect(bearer.getBearerFormat()).toBe('JWT');

    const oauth2 = schemes[3];
    expect(oauth2.getType()).toBe('oauth2');
    const flows = JSON.parse(oauth2.getOauthFlowsJson());
    expect(flows.clientCredentials.tokenUrl).toBe('https://example.com/token');
    expect(flows.clientCredentials.scopes['streetlights:read']).toBe('Read streetlight data');
  });

  it('extracts 3.x security schemes (identical shape to 2.x)', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = listSecuritySchemes(ctx, input);
    const schemes = result.getSchemesList();
    expect(schemes.map((s) => s.getName())).toEqual(['apiKey', 'bearerAuth']);
    expect(schemes[1].getBearerFormat()).toBe('JWT');
  });

  it('returns an empty list when there are no security schemes declared', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = listSecuritySchemes(ctx, input);
    expect(result.getSchemesList()).toHaveLength(0);
  });
});
