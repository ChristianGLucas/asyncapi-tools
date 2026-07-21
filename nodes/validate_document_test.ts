import { AsyncApiDocument } from '../gen/messages_pb';
import { validateDocument } from './validate_document';
import { ctx, FIXTURE_V2, FIXTURE_V3, MINIMAL_V2, MINIMAL_V3, INVALID_DOC, EMPTY_DOC, UNPARSEABLE_YAML, NOT_A_MAPPING_DOC } from './testkit';

describe('ValidateDocument', () => {
  it('reports a well-formed 2.x document as valid with no violations', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getViolationsList()).toHaveLength(0);
    expect(result.getMajorVersion()).toBe(2);
  });

  it('reports a well-formed 3.x document as valid with no violations', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getViolationsList()).toHaveLength(0);
    expect(result.getMajorVersion()).toBe(3);
  });

  it('accepts a minimal document with an empty channels: map for both generations', () => {
    for (const doc of [MINIMAL_V2, MINIMAL_V3]) {
      const input = new AsyncApiDocument();
      input.setContent(doc);
      const result = validateDocument(ctx, input);
      expect(result.getValid()).toBe(true);
    }
  });

  it('reports three violations for a doc with an unrecognized version and missing info fields', () => {
    const input = new AsyncApiDocument();
    input.setContent(INVALID_DOC);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    const paths = result.getViolationsList().map((v) => v.getPath());
    expect(paths).toEqual(expect.arrayContaining(['/asyncapi', '/info/title', '/info/version']));
    expect(result.getViolationsList()).toHaveLength(3);
  });

  it('reports missing-required-field violations for a document with none of the required sections', () => {
    const input = new AsyncApiDocument();
    input.setContent(EMPTY_DOC);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    const paths = result.getViolationsList().map((v) => v.getPath());
    expect(paths).toEqual(expect.arrayContaining(['/asyncapi', '/info', '/channels']));
  });

  it('flags a 3.x operation with an invalid action and a missing channel $ref', () => {
    const doc = `
asyncapi: '3.0.0'
info:
  title: Bad
  version: '1.0.0'
channels:
  foo:
    address: foo
operations:
  badOp:
    action: publish
`;
    const input = new AsyncApiDocument();
    input.setContent(doc);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    const paths = result.getViolationsList().map((v) => v.getPath());
    expect(paths).toContain('/operations/badOp/action');
    expect(paths).toContain('/operations/badOp/channel');
  });

  it('returns a parse_error, valid=false, and no violations for a document that is not a mapping', () => {
    const input = new AsyncApiDocument();
    input.setContent(NOT_A_MAPPING_DOC);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getParseError()).not.toBe('');
    expect(result.getViolationsList()).toHaveLength(0);
  });

  it('returns a parse_error for unparseable YAML, never a crash', () => {
    const input = new AsyncApiDocument();
    input.setContent(UNPARSEABLE_YAML);
    const result = validateDocument(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getParseError()).not.toBe('');
  });
});
