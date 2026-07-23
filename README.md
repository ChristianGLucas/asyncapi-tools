# asyncapi-tools

Deterministic, offline parsing and structural inspection of
[AsyncAPI](https://www.asyncapi.com/) documents — the event-driven-API
specification for Kafka/MQTT/AMQP/WebSocket/etc. APIs, the async/messaging
counterpart to OpenAPI — built for the [Axiom](https://axiomide.com) marketplace,
handle `christiangeorgelucas`.

This completes the API-schema family alongside
[`openapi-tools`](https://github.com/ChristianGLucas/openapi-tools) (REST),
[`graphql-schema-tools`](https://github.com/ChristianGLucas/graphql-schema-tools)
(GraphQL), and [`protobuf-tools`](https://github.com/ChristianGLucas/protobuf-tools)
(gRPC) — deliberately distinct from all three and from
[`dataformat-tools`](https://github.com/ChristianGLucas/dataformat-tools)'
generic YAML/JSON conversion.

Supports **both** AsyncAPI spec generations, which have materially different
document shapes:

- **2.x** — channels carry `publish:`/`subscribe:` operations directly.
- **3.x** — operations are hoisted to a top-level `operations:` map that
  references channels by `$ref`.

Every node detects the generation and branches its extraction accordingly.
The document is always supplied as text by the caller — there is no network
call, no remote `$ref` resolution (ever), no wall-clock, and no randomness.
Every node is a pure, deterministic function of its input.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/asyncapi-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/asyncapi-tools/DetectVersion --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/asyncapi-tools/0.1.0/DetectVersion \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/asyncapi-tools/DetectVersion`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## Nodes

- **DetectVersion** — which spec generation (2 or 3) a document declares.
- **ParseDocument** — top-level structural overview (title, version, section counts).
- **ValidateDocument** — structural well-formedness, reporting every violation found.
- **ExtractInfo** — the `info` block (title, version, description, contact, license, tags).
- **ListChannels** — every channel, unified across 2.x/3.x.
- **ListOperations** — every operation, unified across 2.x/3.x.
- **ListMessages** — every message definition (components + inline).
- **GetMessagePayload** — one message's payload/headers schema by name.
- **ListServers** — every server (protocol, host/url, protocolVersion).
- **ExtractProtocols** — a transport-protocol inventory across servers.
- **ExtractComponents** — an index of the `components` section's named entries.
- **ListSecuritySchemes** — every security scheme with its type-specific fields.
- **ExtractMessageSchemas** — each message payload's `$ref` resolved to its target schema.
- **ExtractServerBindings** / **ExtractOperationBindings** / **ExtractMessageBindings** —
  protocol-specific `bindings:` blocks as structured (scope, protocol, JSON) facts.
- **SummarizeDocument** — whole-document counts.
- **ExtractRefs** — every `$ref` used anywhere in the document (report only).

## Implementation

Parsing is done with [`js-yaml`](https://github.com/nodeca/js-yaml) (MIT), in
its default `CORE_SCHEMA` — safe by construction, since js-yaml v4+ has no tag
capable of constructing an arbitrary JS object or executing code. Explicit
`maxDepth`/`maxAliases` bounds are set on every parse call as defense-in-depth,
on top of this package's own 3 MB byte-size ceiling enforced before the
parser ever sees the input. All AsyncAPI 2.x/3.x schema knowledge (which
field, at which path, means "channel", "operation", "message", "binding") is
this package's own code — not a wrapped AsyncAPI client library.

The heavier `@asyncapi/parser` (Apache-2.0) package was deliberately **not**
used: its full dependency tree is license-clean, but at ~168 transitive
packages / ~55 MB it is disproportionately heavy for pure structural
inspection, so this package implements its own AsyncAPI-schema-semantic
extraction on top of `js-yaml` instead — the same pattern used by this
publisher's `k8s-manifest-tools` and `github-actions-tools`.

A malformed or oversized document returns a structured error, never a crash.
Internal `$ref`s (same-document JSON pointers, `#/...`) are resolved for
several nodes' own output fields, bounded to a small hop count against
reference cycles; an external `$ref` (a remote URL or filesystem path) is
always reported, never fetched.

## License

MIT — see [LICENSE](LICENSE).
