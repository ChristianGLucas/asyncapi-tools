import { AsyncApiDocument } from '../gen/messages_pb';
import { extractInfo } from './extract_info';
import { ctx, FIXTURE_V2, FIXTURE_V3, EMPTY_DOC } from './testkit';

describe('ExtractInfo', () => {
  it('extracts the full 2.x info block', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = extractInfo(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getTitle()).toBe('Streetlights API');
    expect(result.getApiVersion()).toBe('1.0.0');
    expect(result.getDescription()).toBe('The Smartylighting Streetlights API allows you to remotely manage the city lights.');
    expect(result.getTermsOfService()).toBe('https://asyncapi.org/terms/');
    expect(result.getContactName()).toBe('API Support');
    expect(result.getContactUrl()).toBe('https://asyncapi.org/support');
    expect(result.getContactEmail()).toBe('support@asyncapi.org');
    expect(result.getLicenseName()).toBe('Apache 2.0');
    expect(result.getLicenseUrl()).toBe('https://www.apache.org/licenses/LICENSE-2.0.html');
    expect(result.getTagsList()).toEqual(['streetlights', 'iot']);
    expect(result.getExternalDocsUrl()).toBe('https://asyncapi.org/docs');
    expect(result.getError()).toBe('');
  });

  it('extracts a 3.x info block with partial contact fields left empty', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = extractInfo(ctx, input);
    expect(result.getFound()).toBe(true);
    expect(result.getTitle()).toBe('Streetlights API v3');
    expect(result.getApiVersion()).toBe('2.0.0');
    expect(result.getContactName()).toBe('API Support');
    expect(result.getContactEmail()).toBe('support@asyncapi.org');
    expect(result.getContactUrl()).toBe(''); // not declared in the v3 fixture
    expect(result.getTagsList()).toEqual(['streetlights']);
    expect(result.getExternalDocsUrl()).toBe(''); // not declared in the v3 fixture
  });

  it('returns found=false and an error for a document with no info: block', () => {
    const input = new AsyncApiDocument();
    input.setContent(EMPTY_DOC);
    const result = extractInfo(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).not.toBe('');
    expect(result.getTitle()).toBe('');
  });
});
