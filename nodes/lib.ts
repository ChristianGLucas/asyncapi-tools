// Shared bounds, SAFE YAML/JSON parsing, internal-$ref resolution, and
// AsyncAPI-schema-semantic extraction helpers for the asyncapi-tools nodes.
// Not a node and not a test file, so it is neither registered nor collected
// by jest.
//
// The parse layer is entirely owned by js-yaml (js-yaml.github.io) — nothing
// here reimplements YAML/JSON parsing (JSON is a syntactic subset of YAML,
// so a single yaml.load handles both). What lives here is: (a) a
// single-document safe parse (with a `maxDepth` bound purely to keep the
// recursive-descent composer within the JS call stack — see MAX_YAML_DEPTH
// below), (b) bounded internal-only $ref resolution (never fetches a remote
// URL or filesystem path), and (c) the AsyncAPI 2.x/3.x document-schema
// knowledge (which field, at which path, means "channel", "operation",
// "message", "binding", etc., and how those shapes differ between the two
// spec generations) — that knowledge is this package's actual value-add,
// not something any generic YAML library provides. Payload size and
// resource limits are the platform's responsibility, not this node's.
//
// SAFETY: js-yaml v5's `load()` uses CORE_SCHEMA by default, which resolves
// only plain YAML scalars/sequences/mappings (strings, numbers, bools,
// null, arrays, objects) — there is no `!!js/function`, `!!js/regexp`, or
// any other tag capable of constructing an arbitrary JS object or executing
// code. That capability does not exist anywhere in js-yaml's codebase (it
// was fully removed, not merely opt-in, since v4) unless a caller
// explicitly installs the separate `js-yaml-js-types` package, which this
// package does not depend on.

import * as yaml from 'js-yaml';

/** js-yaml's own collection-nesting-depth bound (does not count aliases).
 * This exists to keep the recursive-descent YAML composer within the JS
 * call stack (unbounded nesting is a genuine stack-overflow risk, not a
 * memory/DoS concern) — kept for that reason even though payload-size and
 * resource guards are otherwise the platform's job, not this node's. Real
 * AsyncAPI documents rarely nest more than ~15 levels (schema-within-
 * schema-within-components); 100 is generous headroom. */
export const MAX_YAML_DEPTH = 100;

/** Bound on internal $ref resolution hops, so a $ref chain (or an
 * undetected cycle) can never recurse unboundedly. Real documents resolve
 * in 1-2 hops (e.g. operation.messages[i] -> channel.messages.key ->
 * components.messages.Name); 10 is generous headroom. */
export const MAX_REF_HOPS = 10;

/** Turns a caught value into a stable error message. */
export function errorMessage(e: unknown, context: string): string {
  if (e instanceof Error) {
    return `${context}: ${e.message}`;
  }
  return `${context}: ${String(e)}`;
}

// ---------------------------------------------------------------------------
// Safe single-document parse
// ---------------------------------------------------------------------------

export interface ParsedDoc {
  data: unknown;
  /** Non-null exactly when data is undefined. */
  parseError: string | null;
}

/** Safely parses an AsyncAPI document's raw text (JSON or YAML — JSON
 * parses cleanly through the same YAML loader since it is a syntactic
 * subset). Never throws — any parse problem (including pathologically deep
 * nesting hitting MAX_YAML_DEPTH) is reported through parseError instead. */
export function parseDocument(text: string, field = 'content'): ParsedDoc {
  try {
    const data = yaml.load(text, {
      maxDepth: MAX_YAML_DEPTH,
    });
    return { data, parseError: null };
  } catch (e) {
    return { data: undefined, parseError: errorMessage(e, 'parse error') };
  }
}

// ---------------------------------------------------------------------------
// Generic shape helpers
// ---------------------------------------------------------------------------

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function asString(v: unknown): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return '';
}

export function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

export function getIn(obj: unknown, path: string[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (!isPlainObject(cur)) return undefined;
    cur = cur[key];
  }
  return cur;
}

/** True when the document is at least a mapping — the minimum shape needed
 * to look for asyncapi:/info:/channels: at all. */
export function looksLikeDocument(data: unknown): boolean {
  return isPlainObject(data);
}

// ---------------------------------------------------------------------------
// Version detection
// ---------------------------------------------------------------------------

export interface DetectedVersion {
  majorVersion: number;
  versionString: string;
}

/** Reads the document's `asyncapi:` field and extracts a major version (2
 * or 3), or 0 if the document has no parseable "N.x.x"-shaped version
 * string. Never throws. */
export function detectVersion(data: unknown): DetectedVersion {
  if (!isPlainObject(data)) return { majorVersion: 0, versionString: '' };
  const raw = data.asyncapi;
  const versionString = asString(raw);
  if (versionString === '') return { majorVersion: 0, versionString: '' };
  const m = /^(\d+)\./.exec(versionString);
  if (!m) return { majorVersion: 0, versionString };
  const majorVersion = parseInt(m[1], 10);
  return { majorVersion: majorVersion === 2 || majorVersion === 3 ? majorVersion : 0, versionString };
}

// ---------------------------------------------------------------------------
// Internal-only $ref resolution (JSON Pointer against the parsed document)
// ---------------------------------------------------------------------------

function decodeRefSegment(s: string): string {
  return s.replace(/~1/g, '/').replace(/~0/g, '~');
}

/** True for a same-document JSON Pointer ref ("#/..."). Everything else
 * (a bare URL, a relative/absolute file path, "otherfile.yaml#/...") is
 * external and is NEVER fetched — only reported. */
export function isInternalRef(ref: string): boolean {
  return ref.startsWith('#/');
}

/** Resolves a same-document JSON Pointer against the parsed root. Returns
 * undefined for an external ref, a malformed pointer, or a pointer that
 * targets nothing. Never throws, never fetches anything. */
export function resolveJsonPointer(root: unknown, ref: string): unknown {
  if (!isInternalRef(ref)) return undefined;
  const segments = ref
    .slice(2)
    .split('/')
    .filter((s) => s.length > 0)
    .map(decodeRefSegment);
  let cur: unknown = root;
  for (const seg of segments) {
    if (isPlainObject(cur)) {
      cur = cur[seg];
    } else if (Array.isArray(cur)) {
      const idx = Number(seg);
      cur = Number.isInteger(idx) ? cur[idx] : undefined;
    } else {
      return undefined;
    }
  }
  return cur;
}

export interface RefResolution {
  resolved: unknown;
  /** True if a $ref was followed but a hop failed (external target, dead
   * pointer, or the hop budget was exhausted) — the chain is unresolved,
   * never expanded further. */
  chainBroken: boolean;
  /** The last (or only) $ref string encountered, "" if the value was not
   * itself a $ref wrapper. */
  lastRef: string;
}

/** Follows a `{ $ref: "#/..." }`-wrapper chain to its concrete value,
 * bounded by MAX_REF_HOPS so a cycle or long chain can never recurse
 * unboundedly. If `value` is not itself a $ref wrapper, returns it as-is
 * with chainBroken=false. */
export function resolveRefChain(root: unknown, value: unknown, maxHops = MAX_REF_HOPS): RefResolution {
  let cur = value;
  let lastRef = '';
  let hops = 0;
  while (isPlainObject(cur) && typeof cur.$ref === 'string') {
    lastRef = cur.$ref;
    if (hops >= maxHops) return { resolved: undefined, chainBroken: true, lastRef };
    const next = resolveJsonPointer(root, cur.$ref);
    if (next === undefined) return { resolved: undefined, chainBroken: true, lastRef };
    cur = next;
    hops++;
  }
  return { resolved: cur, chainBroken: false, lastRef };
}

/** Last path segment of a $ref string, used as a fallback display name
 * when the resolved target has no better name of its own
 * (e.g. "#/components/messages/UserSignedUp" -> "UserSignedUp"). */
export function refBasename(ref: string): string {
  if (!ref) return '';
  const parts = ref.split('/');
  return parts[parts.length - 1] || '';
}

// ---------------------------------------------------------------------------
// $ref inventory (report-only, walks the whole tree)
// ---------------------------------------------------------------------------

/** Walks the entire parsed document collecting every string value found
 * under a `$ref` key, in first-seen document order (deduplicated). Purely
 * a report — never resolves or fetches anything. Recursion is bounded by
 * MAX_YAML_DEPTH having already bounded the parse itself. */
export function collectAllRefs(data: unknown): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  function visit(v: unknown): void {
    if (isPlainObject(v)) {
      for (const key of Object.keys(v)) {
        if (key === '$ref' && typeof v[key] === 'string') {
          const ref = v[key] as string;
          if (!seen.has(ref)) {
            seen.add(ref);
            order.push(ref);
          }
        } else {
          visit(v[key]);
        }
      }
    } else if (Array.isArray(v)) {
      for (const item of v) visit(item);
    }
  }
  visit(data);
  return order;
}

// ---------------------------------------------------------------------------
// info:
// ---------------------------------------------------------------------------

export interface InfoBlock {
  found: boolean;
  title: string;
  apiVersion: string;
  description: string;
  termsOfService: string;
  contactName: string;
  contactUrl: string;
  contactEmail: string;
  licenseName: string;
  licenseUrl: string;
  tags: string[];
  externalDocsUrl: string;
}

/** Extracts the `info:` block. AsyncAPI's info shape is identical between
 * 2.x and 3.x. */
export function extractInfo(data: unknown): InfoBlock {
  const empty: InfoBlock = {
    found: false,
    title: '',
    apiVersion: '',
    description: '',
    termsOfService: '',
    contactName: '',
    contactUrl: '',
    contactEmail: '',
    licenseName: '',
    licenseUrl: '',
    tags: [],
    externalDocsUrl: '',
  };
  if (!isPlainObject(data)) return empty;
  const info = data.info;
  if (!isPlainObject(info)) return empty;
  const contact = isPlainObject(info.contact) ? info.contact : {};
  const license = isPlainObject(info.license) ? info.license : {};
  const tagsRaw = asArray(info.tags);
  const tags = tagsRaw
    .map((t) => (isPlainObject(t) ? asString(t.name) : asString(t)))
    .filter((t) => t !== '');
  const externalDocs = isPlainObject(info.externalDocs) ? info.externalDocs : {};
  return {
    found: true,
    title: asString(info.title),
    apiVersion: asString(info.version),
    description: asString(info.description),
    termsOfService: asString(info.termsOfService),
    contactName: asString(contact.name),
    contactUrl: asString(contact.url),
    contactEmail: asString(contact.email),
    licenseName: asString(license.name),
    licenseUrl: asString(license.url),
    tags,
    externalDocsUrl: asString(externalDocs.url),
  };
}

// ---------------------------------------------------------------------------
// components:
// ---------------------------------------------------------------------------

export function componentsOf(data: unknown): Record<string, unknown> {
  if (!isPlainObject(data)) return {};
  return isPlainObject(data.components) ? data.components : {};
}

export function namedKeys(container: unknown, key: string): string[] {
  const section = isPlainObject(container) ? container[key] : undefined;
  return isPlainObject(section) ? Object.keys(section) : [];
}

// ---------------------------------------------------------------------------
// servers:
// ---------------------------------------------------------------------------

export interface ServerEntry {
  name: string;
  url: string;
  host: string;
  pathname: string;
  protocol: string;
  protocolVersion: string;
  description: string;
  raw: Record<string, unknown>;
}

/** Extracts the `servers:` map, normalizing 2.x's `url:` and 3.x's
 * `host:`/`pathname:` into a single `url` field for callers that don't
 * care about the version split, while preserving the raw host/pathname
 * split for 3.x callers that do. */
export function listServerEntries(data: unknown): ServerEntry[] {
  if (!isPlainObject(data)) return [];
  const servers = data.servers;
  if (!isPlainObject(servers)) return [];
  const out: ServerEntry[] = [];
  for (const name of Object.keys(servers)) {
    const s = servers[name];
    if (!isPlainObject(s)) continue;
    const host = asString(s.host);
    const pathname = asString(s.pathname);
    const explicitUrl = asString(s.url);
    const url = explicitUrl !== '' ? explicitUrl : host !== '' ? host + pathname : '';
    out.push({
      name,
      url,
      host,
      pathname,
      protocol: asString(s.protocol),
      protocolVersion: asString(s.protocolVersion),
      description: asString(s.description),
      raw: s,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// channels: (version-aware)
// ---------------------------------------------------------------------------

/** Resolves a channel-scoped or component-scoped "message" value to a
 * display name: follows a $ref chain if present, else falls back to an
 * inline `name`/`messageId` field, else the $ref's basename, else "". */
export function resolveMessageName(root: unknown, value: unknown): string {
  const { resolved, lastRef } = resolveRefChain(root, value);
  if (isPlainObject(resolved)) {
    const declared = asString(resolved.name) || asString(resolved.messageId);
    if (declared !== '') return declared;
  }
  if (lastRef !== '') return refBasename(lastRef);
  return '';
}

export interface ChannelEntry {
  name: string;
  address: string;
  description: string;
  messageNames: string[];
  hasPublish: boolean;
  hasSubscribe: boolean;
  parameterNames: string[];
}

/** Extracts the `channels:` map for a 2.x document: channel key + its
 * publish/subscribe operations' resolved message name(s). */
function listChannels2(root: Record<string, unknown>): ChannelEntry[] {
  const channels = root.channels;
  if (!isPlainObject(channels)) return [];
  const out: ChannelEntry[] = [];
  for (const name of Object.keys(channels)) {
    const ch = channels[name];
    if (!isPlainObject(ch)) continue;
    const messageNames: string[] = [];
    const publish = isPlainObject(ch.publish) ? ch.publish : undefined;
    const subscribe = isPlainObject(ch.subscribe) ? ch.subscribe : undefined;
    if (publish && publish.message !== undefined) {
      const n = resolveMessageName(root, publish.message);
      if (n !== '') messageNames.push(n);
    }
    if (subscribe && subscribe.message !== undefined) {
      const n = resolveMessageName(root, subscribe.message);
      if (n !== '') messageNames.push(n);
    }
    out.push({
      name,
      address: '',
      description: asString(ch.description),
      messageNames,
      hasPublish: publish !== undefined,
      hasSubscribe: subscribe !== undefined,
      parameterNames: isPlainObject(ch.parameters) ? Object.keys(ch.parameters) : [],
    });
  }
  return out;
}

/** Extracts the `channels:` map for a 3.x document: channel key + address
 * + resolved message name(s) from its `messages:` map. */
function listChannels3(root: Record<string, unknown>): ChannelEntry[] {
  const channels = root.channels;
  if (!isPlainObject(channels)) return [];
  const out: ChannelEntry[] = [];
  for (const name of Object.keys(channels)) {
    const ch = channels[name];
    if (!isPlainObject(ch)) continue;
    const address = asString(ch.address) || name;
    const messagesMap = isPlainObject(ch.messages) ? ch.messages : {};
    const messageNames = Object.keys(messagesMap)
      .map((k) => resolveMessageName(root, messagesMap[k]) || k)
      .filter((n) => n !== '');
    out.push({
      name,
      address,
      description: asString(ch.description),
      messageNames,
      hasPublish: false,
      hasSubscribe: false,
      parameterNames: isPlainObject(ch.parameters) ? Object.keys(ch.parameters) : [],
    });
  }
  return out;
}

export function listChannelEntries(root: Record<string, unknown>, majorVersion: number): ChannelEntry[] {
  return majorVersion === 3 ? listChannels3(root) : listChannels2(root);
}

// ---------------------------------------------------------------------------
// operations: (version-aware)
// ---------------------------------------------------------------------------

export interface OperationEntry {
  operationId: string;
  action: string;
  channel: string;
  summary: string;
  description: string;
  messageNames: string[];
}

/** For a 2.x document, operations live inside each channel's `publish:`/
 * `subscribe:` block — this flattens them into one list. */
function listOperations2(root: Record<string, unknown>): OperationEntry[] {
  const channels = root.channels;
  if (!isPlainObject(channels)) return [];
  const out: OperationEntry[] = [];
  for (const channelName of Object.keys(channels)) {
    const ch = channels[channelName];
    if (!isPlainObject(ch)) continue;
    for (const action of ['publish', 'subscribe'] as const) {
      const op = ch[action];
      if (!isPlainObject(op)) continue;
      const messageNames: string[] = [];
      if (op.message !== undefined) {
        const n = resolveMessageName(root, op.message);
        if (n !== '') messageNames.push(n);
      }
      out.push({
        operationId: asString(op.operationId),
        action,
        channel: channelName,
        summary: asString(op.summary),
        description: asString(op.description),
        messageNames,
      });
    }
  }
  return out;
}

/** For a 3.x document, `operations:` is a top-level map whose entries
 * reference their channel by $ref. */
function listOperations3(root: Record<string, unknown>): OperationEntry[] {
  const operations = root.operations;
  if (!isPlainObject(operations)) return [];
  const out: OperationEntry[] = [];
  for (const opId of Object.keys(operations)) {
    const op = operations[opId];
    if (!isPlainObject(op)) continue;
    let channel = '';
    if (isPlainObject(op.channel) && typeof op.channel.$ref === 'string') {
      channel = refBasename(op.channel.$ref);
    }
    const messageNames: string[] = [];
    for (const m of asArray(op.messages)) {
      const n = resolveMessageName(root, m);
      if (n !== '') messageNames.push(n);
    }
    out.push({
      operationId: opId,
      action: asString(op.action),
      channel,
      summary: asString(op.summary),
      description: asString(op.description),
      messageNames,
    });
  }
  return out;
}

export function listOperationEntries(root: Record<string, unknown>, majorVersion: number): OperationEntry[] {
  return majorVersion === 3 ? listOperations3(root) : listOperations2(root);
}

// ---------------------------------------------------------------------------
// messages (components.messages + inline channel/operation messages)
// ---------------------------------------------------------------------------

export interface MessageEntry {
  name: string;
  title: string;
  summary: string;
  description: string;
  contentType: string;
  hasPayload: boolean;
  hasHeaders: boolean;
  source: string;
}

function messageEntryFrom(name: string, m: Record<string, unknown>, source: string): MessageEntry {
  return {
    name,
    title: asString(m.title),
    summary: asString(m.summary),
    description: asString(m.description),
    contentType: asString(m.contentType),
    hasPayload: m.payload !== undefined,
    hasHeaders: m.headers !== undefined,
    source,
  };
}

/** Lists every message DEFINITION found: named entries under
 * components.messages first (the canonical, addressable collection), then
 * any inline (non-$ref) message objects found under channels/operations
 * that aren't already covered. Deduplicates by resolved name, preferring
 * the components.messages copy when the same name appears both places. */
export function listMessageEntries(root: Record<string, unknown>, majorVersion: number): MessageEntry[] {
  const seen = new Set<string>();
  const out: MessageEntry[] = [];

  const components = componentsOf(root);
  const compMessages = isPlainObject(components.messages) ? components.messages : {};
  for (const name of Object.keys(compMessages)) {
    const m = compMessages[name];
    if (!isPlainObject(m)) continue;
    out.push(messageEntryFrom(name, m, 'components.messages'));
    seen.add(name);
  }

  function considerInline(value: unknown, pathHint: string): void {
    if (!isPlainObject(value)) return;
    if (typeof value.$ref === 'string') return; // a ref, not an inline definition
    const declaredName = asString(value.name) || asString(value.messageId);
    const name = declaredName !== '' ? declaredName : pathHint;
    if (seen.has(name)) return;
    seen.add(name);
    out.push(messageEntryFrom(name, value, pathHint));
  }

  const channels = isPlainObject(root.channels) ? root.channels : {};
  if (majorVersion === 3) {
    for (const chName of Object.keys(channels)) {
      const ch = channels[chName];
      if (!isPlainObject(ch)) continue;
      const msgs = isPlainObject(ch.messages) ? ch.messages : {};
      for (const key of Object.keys(msgs)) {
        considerInline(msgs[key], `channels.${chName}.messages.${key}`);
      }
    }
  } else {
    for (const chName of Object.keys(channels)) {
      const ch = channels[chName];
      if (!isPlainObject(ch)) continue;
      for (const action of ['publish', 'subscribe'] as const) {
        const op = ch[action];
        if (isPlainObject(op) && op.message !== undefined) {
          considerInline(op.message, `channels.${chName}.${action}.message`);
        }
      }
    }
  }

  return out;
}

/** Looks up one message by name: first in components.messages, then among
 * inline (non-$ref) message definitions found via listMessageEntries'
 * traversal — but returning the RAW object (not the flattened summary) so
 * callers can read payload/headers directly. */
export function findMessageRaw(root: Record<string, unknown>, majorVersion: number, name: string): Record<string, unknown> | undefined {
  const components = componentsOf(root);
  const compMessages = isPlainObject(components.messages) ? components.messages : {};
  if (isPlainObject(compMessages[name])) return compMessages[name] as Record<string, unknown>;

  const channels = isPlainObject(root.channels) ? root.channels : {};
  if (majorVersion === 3) {
    for (const chName of Object.keys(channels)) {
      const ch = channels[chName];
      if (!isPlainObject(ch)) continue;
      const msgs = isPlainObject(ch.messages) ? ch.messages : {};
      for (const key of Object.keys(msgs)) {
        const raw = msgs[key];
        if (!isPlainObject(raw) || typeof raw.$ref === 'string') continue;
        const declared = asString(raw.name) || asString(raw.messageId);
        const effectiveName = declared !== '' ? declared : `channels.${chName}.messages.${key}`;
        if (effectiveName === name) return raw;
      }
    }
  } else {
    for (const chName of Object.keys(channels)) {
      const ch = channels[chName];
      if (!isPlainObject(ch)) continue;
      for (const action of ['publish', 'subscribe'] as const) {
        const op = ch[action];
        if (!isPlainObject(op) || op.message === undefined) continue;
        const raw = op.message;
        if (!isPlainObject(raw) || typeof raw.$ref === 'string') continue;
        const declared = asString(raw.name) || asString(raw.messageId);
        const effectiveName = declared !== '' ? declared : `channels.${chName}.${action}.message`;
        if (effectiveName === name) return raw;
      }
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// securitySchemes:
// ---------------------------------------------------------------------------

export interface SecuritySchemeEntry {
  name: string;
  type: string;
  scheme: string;
  bearerFormat: string;
  apiKeyIn: string;
  apiKeyName: string;
  oauthFlowsJson: string;
  openIdConnectUrl: string;
  description: string;
}

export function listSecuritySchemeEntries(root: Record<string, unknown>): SecuritySchemeEntry[] {
  const components = componentsOf(root);
  const schemes = isPlainObject(components.securitySchemes) ? components.securitySchemes : {};
  const out: SecuritySchemeEntry[] = [];
  for (const name of Object.keys(schemes)) {
    const s = schemes[name];
    if (!isPlainObject(s)) continue;
    const type = asString(s.type);
    let apiKeyIn = '';
    let apiKeyName = '';
    if (type === 'apiKey') {
      apiKeyIn = asString(s.in); // "user" | "password"
    } else if (type === 'httpApiKey') {
      apiKeyIn = asString(s.in); // "query" | "header" | "cookie"
      apiKeyName = asString(s.name);
    }
    out.push({
      name,
      type,
      scheme: asString(s.scheme),
      bearerFormat: asString(s.bearerFormat),
      apiKeyIn,
      apiKeyName,
      oauthFlowsJson: s.flows !== undefined ? safeJsonStringify(s.flows) : '',
      openIdConnectUrl: asString(s.openIdConnectUrl),
      description: asString(s.description),
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// bindings: (server / operation / message — all share the same shape)
// ---------------------------------------------------------------------------

export interface BindingRow {
  scopeName: string;
  protocol: string;
  bindingsJson: string;
}

function bindingRowsFor(scopeName: string, bindings: unknown): BindingRow[] {
  if (!isPlainObject(bindings)) return [];
  const out: BindingRow[] = [];
  for (const protocol of Object.keys(bindings)) {
    out.push({ scopeName, protocol, bindingsJson: safeJsonStringify(bindings[protocol]) });
  }
  return out;
}

export function extractServerBindingRows(root: Record<string, unknown>): BindingRow[] {
  const servers = isPlainObject(root.servers) ? root.servers : {};
  const out: BindingRow[] = [];
  for (const name of Object.keys(servers)) {
    const s = servers[name];
    if (isPlainObject(s)) out.push(...bindingRowsFor(name, s.bindings));
  }
  return out;
}

/** Covers both generations: 2.x carries bindings on each channel's
 * publish:/subscribe: block; 3.x carries them directly on each top-level
 * operation. scopeName is the operationId (2.x) / operation key (3.x),
 * falling back to "<channel>.<action>" for an unnamed 2.x operation. */
export function extractOperationBindingRows(root: Record<string, unknown>, majorVersion: number): BindingRow[] {
  const out: BindingRow[] = [];
  if (majorVersion === 3) {
    const operations = isPlainObject(root.operations) ? root.operations : {};
    for (const opId of Object.keys(operations)) {
      const op = operations[opId];
      if (isPlainObject(op)) out.push(...bindingRowsFor(opId, op.bindings));
    }
    return out;
  }
  const channels = isPlainObject(root.channels) ? root.channels : {};
  for (const chName of Object.keys(channels)) {
    const ch = channels[chName];
    if (!isPlainObject(ch)) continue;
    for (const action of ['publish', 'subscribe'] as const) {
      const op = ch[action];
      if (!isPlainObject(op)) continue;
      const scopeName = asString(op.operationId) || `${chName}.${action}`;
      out.push(...bindingRowsFor(scopeName, op.bindings));
    }
  }
  return out;
}

/** Message bindings, scanned across components.messages (the canonical,
 * addressable collection every message ultimately resolves through). */
export function extractMessageBindingRows(root: Record<string, unknown>): BindingRow[] {
  const components = componentsOf(root);
  const messages = isPlainObject(components.messages) ? components.messages : {};
  const out: BindingRow[] = [];
  for (const name of Object.keys(messages)) {
    const m = messages[name];
    if (isPlainObject(m)) out.push(...bindingRowsFor(name, m.bindings));
  }
  return out;
}

// ---------------------------------------------------------------------------
// JSON serialization helper
// ---------------------------------------------------------------------------

/** JSON.stringify that never throws (parsed YAML data is always plain
 * JSON-compatible values, but this guards defensively regardless). */
export function safeJsonStringify(v: unknown): string {
  try {
    return JSON.stringify(v ?? {});
  } catch {
    return '{}';
  }
}
