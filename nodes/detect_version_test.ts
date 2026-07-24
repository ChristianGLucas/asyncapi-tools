import { AsyncApiDocument } from '../gen/messages_pb';
import { detectVersion } from './detect_version';
import { ctx, FIXTURE_V2, FIXTURE_V3, EMPTY_DOC, UNPARSEABLE_YAML, NOT_A_MAPPING_DOC } from './testkit';

describe('DetectVersion', () => {
  it('detects a 2.x document', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = detectVersion(ctx, input);
    expect(result.getMajorVersion()).toBe(2);
    expect(result.getVersionString()).toBe('2.6.0');
    expect(result.getParseError()).toBe('');
  });

  it('detects a 3.x document', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = detectVersion(ctx, input);
    expect(result.getMajorVersion()).toBe(3);
    expect(result.getVersionString()).toBe('3.0.0');
  });

  it('returns major_version 0 with an empty version_string when asyncapi: is absent', () => {
    const input = new AsyncApiDocument();
    input.setContent(EMPTY_DOC);
    const result = detectVersion(ctx, input);
    expect(result.getMajorVersion()).toBe(0);
    expect(result.getVersionString()).toBe('');
  });

  it('returns major_version 0 for an unrecognized version family (e.g. 1.x)', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '1.2.0'\ninfo: {}\nchannels: {}\n");
    const result = detectVersion(ctx, input);
    expect(result.getMajorVersion()).toBe(0);
    expect(result.getVersionString()).toBe('1.2.0');
  });

  it('returns a structured parse_error for unparseable YAML, never a crash', () => {
    const input = new AsyncApiDocument();
    input.setContent(UNPARSEABLE_YAML);
    const result = detectVersion(ctx, input);
    expect(result.getParseError()).not.toBe('');
  });

  it('returns a structured parse_error for a document that is not a mapping', () => {
    const input = new AsyncApiDocument();
    input.setContent(NOT_A_MAPPING_DOC);
    const result = detectVersion(ctx, input);
    expect(result.getParseError()).not.toBe('');
  });

  it('handles a large input without crashing (no payload-size limit)', () => {
    // No byte-size cap is imposed by this node -- the platform bounds
    // payload size, not this node. A large but well-formed document still
    // parses cleanly.
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: x\n  version: '1'\ndescription: '" + 'x'.repeat(3_100_000) + "'\nchannels: {}\n");
    const result = detectVersion(ctx, input);
    expect(result.getParseError()).toBe('');
    expect(result.getMajorVersion()).toBe(2);
  });

  it('is deterministic across repeated calls on the same input', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const r1 = detectVersion(ctx, input);
    const r2 = detectVersion(ctx, input);
    expect(r1.getMajorVersion()).toBe(r2.getMajorVersion());
    expect(r1.getVersionString()).toBe(r2.getVersionString());
  });
});
