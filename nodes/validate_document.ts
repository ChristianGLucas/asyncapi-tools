import { AsyncApiDocument, ValidateDocumentOutput, DocViolation } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseDocument, looksLikeDocument, detectVersion, isPlainObject, asString } from './lib';

function violation(path: string, message: string): DocViolation {
  const v = new DocViolation();
  v.setPath(path);
  v.setMessage(message);
  return v;
}

/**
 * Validates that a document is structurally well-formed AsyncAPI: a
 * recognized `asyncapi:` version, a present `info.title`/`info.version`,
 * a well-shaped `channels:` map, and (3.x only) a well-shaped top-level
 * `operations:` map whose entries declare a valid `action` and a `channel`
 * $ref. This is structural validation of the shapes this package itself
 * depends on to extract data correctly — not full JSON-Schema validation
 * against the official AsyncAPI meta-schema. Never throws; a malformed or
 * oversized document comes back with valid=false and a populated
 * parse_error or violations list.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateDocument(ax: AxiomContext, input: AsyncApiDocument): ValidateDocumentOutput {
  const out = new ValidateDocumentOutput();
  const { data, parseError } = parseDocument(input.getContent());
  if (parseError !== null) {
    out.setParseError(parseError);
    out.setValid(false);
    return out;
  }
  if (!looksLikeDocument(data)) {
    out.setParseError('document is not a mapping');
    out.setValid(false);
    return out;
  }
  const doc = data as Record<string, unknown>;
  const violations: DocViolation[] = [];

  const { majorVersion, versionString } = detectVersion(doc);
  out.setMajorVersion(majorVersion);
  out.setVersionString(versionString);

  if (versionString === '') {
    violations.push(violation('/asyncapi', 'missing required field: asyncapi'));
  } else if (majorVersion === 0) {
    violations.push(violation('/asyncapi', `unrecognized or unsupported asyncapi version: "${versionString}"`));
  }

  const info = doc.info;
  if (!isPlainObject(info)) {
    violations.push(violation('/info', 'missing required field: info'));
  } else {
    if (asString(info.title) === '') violations.push(violation('/info/title', 'missing required field: info.title'));
    if (asString(info.version) === '') violations.push(violation('/info/version', 'missing required field: info.version'));
  }

  if (doc.channels === undefined) {
    violations.push(violation('/channels', 'missing required field: channels'));
  } else if (!isPlainObject(doc.channels)) {
    violations.push(violation('/channels', 'channels must be a mapping'));
  } else if (majorVersion === 2) {
    for (const [name, ch] of Object.entries(doc.channels)) {
      if (!isPlainObject(ch)) {
        violations.push(violation(`/channels/${name}`, 'channel must be a mapping'));
        continue;
      }
      if (ch.publish !== undefined && !isPlainObject(ch.publish)) {
        violations.push(violation(`/channels/${name}/publish`, 'publish must be a mapping'));
      }
      if (ch.subscribe !== undefined && !isPlainObject(ch.subscribe)) {
        violations.push(violation(`/channels/${name}/subscribe`, 'subscribe must be a mapping'));
      }
    }
  }

  if (doc.servers !== undefined) {
    if (!isPlainObject(doc.servers)) {
      violations.push(violation('/servers', 'servers must be a mapping'));
    } else {
      for (const [name, s] of Object.entries(doc.servers)) {
        if (!isPlainObject(s)) {
          violations.push(violation(`/servers/${name}`, 'server must be a mapping'));
          continue;
        }
        if (asString(s.protocol) === '') {
          violations.push(violation(`/servers/${name}/protocol`, 'missing required field: protocol'));
        }
        if (majorVersion === 2 && asString(s.url) === '') {
          violations.push(violation(`/servers/${name}/url`, 'missing required field: url'));
        }
        if (majorVersion === 3 && asString(s.host) === '') {
          violations.push(violation(`/servers/${name}/host`, 'missing required field: host'));
        }
      }
    }
  }

  if (majorVersion === 3 && doc.operations !== undefined) {
    if (!isPlainObject(doc.operations)) {
      violations.push(violation('/operations', 'operations must be a mapping'));
    } else {
      for (const [opId, op] of Object.entries(doc.operations)) {
        if (!isPlainObject(op)) {
          violations.push(violation(`/operations/${opId}`, 'operation must be a mapping'));
          continue;
        }
        const action = asString(op.action);
        if (action !== 'send' && action !== 'receive') {
          violations.push(violation(`/operations/${opId}/action`, `action must be "send" or "receive", got "${action}"`));
        }
        if (!isPlainObject(op.channel) || typeof op.channel.$ref !== 'string' || op.channel.$ref === '') {
          violations.push(violation(`/operations/${opId}/channel`, 'missing required $ref: channel'));
        }
      }
    }
  }

  if (doc.components !== undefined && !isPlainObject(doc.components)) {
    violations.push(violation('/components', 'components must be a mapping'));
  }

  out.setViolationsList(violations);
  out.setValid(violations.length === 0);
  return out;
}
