// Shared test context and fixture AsyncAPI documents for asyncapi-tools
// node unit tests. Not a node and not a test file (no describe/it), so it
// is neither registered as a node nor collected by jest.
import { AxiomContext, AxiomLogger, AxiomSecrets, AxiomReflection, AxiomMutation } from '../gen/axiomContext';

const reflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const mutation: AxiomMutation = {
  flow: {
    addNode: (_p: string, _v: string) => 0,
    addEdge: (_s: number, _d: number) => {},
  },
};

export const ctx: AxiomContext = {
  log: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } satisfies AxiomLogger,
  secrets: { get: (_n: string): [string, boolean] => ['', false] } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection,
  mutation,
};

/**
 * FIXTURE_V2 — a hand-authored AsyncAPI 2.6.0 document (the "Streetlights"
 * example, extended) exercising: info (title/version/description/
 * termsOfService/contact/license/tags/externalDocs), two servers on two
 * different protocols (kafka, mqtt) with server-level security + kafka
 * bindings, three channels — one `subscribe`-only with a $ref message +
 * channel parameters + operation-level kafka bindings, one `publish`-only
 * with a $ref message + kafka bindings, and one `publish`-only with an
 * INLINE (non-$ref) message (for inline-message-extraction coverage) —
 * components.messages with two named messages (one carrying payload +
 * headers + message-level kafka bindings, one with an INLINE payload
 * schema instead of a $ref, plus a third message with an EXTERNAL $ref
 * payload, unreferenced by any channel, for external-ref coverage),
 * components.schemas, components.parameters, and four security schemes
 * covering apiKey/httpApiKey/http-bearer/oauth2.
 *
 * Every oracle constant below was derived by reading THIS TEXT directly
 * (independent of this package's own extraction code) and hand-mapping it
 * to each node's documented semantics against the AsyncAPI 2.6.0
 * specification — never by running this package's own nodes and copying
 * their output.
 */
export const FIXTURE_V2 = `
asyncapi: '2.6.0'
info:
  title: Streetlights API
  version: 1.0.0
  description: The Smartylighting Streetlights API allows you to remotely manage the city lights.
  termsOfService: https://asyncapi.org/terms/
  contact:
    name: API Support
    url: https://asyncapi.org/support
    email: support@asyncapi.org
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  tags:
    - name: streetlights
    - name: iot
  externalDocs:
    url: https://asyncapi.org/docs

servers:
  production:
    url: api.streetlights.smartylighting.com:9092
    protocol: kafka
    protocolVersion: '3.2'
    description: Production Kafka broker
    security:
      - apiKey: []
    bindings:
      kafka:
        schemaRegistryUrl: https://schema-registry.example.com
        schemaRegistryVendor: confluent
  staging:
    url: staging.streetlights.smartylighting.com:1883
    protocol: mqtt
    protocolVersion: '3.1.1'
    description: Staging MQTT broker

channels:
  light/measured:
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        schema:
          type: string
    subscribe:
      operationId: receiveLightMeasurement
      summary: Inform about environmental lighting conditions of a particular streetlight.
      description: Receives light measurement events.
      message:
        \$ref: '#/components/messages/lightMeasured'
      bindings:
        kafka:
          groupId: light-measured-group
          clientId: light-measured-client
  light/turn/on:
    description: Command a particular streetlight to turn the lights on.
    publish:
      operationId: turnOn
      summary: Command a service to turn on the lights.
      message:
        \$ref: '#/components/messages/turnOnOff'
      bindings:
        kafka:
          key:
            type: string
  light/inline/status:
    description: An inline (non-ref) message channel.
    publish:
      operationId: publishInlineStatus
      summary: Publish inline status.
      message:
        name: inlineStatus
        title: Inline Status
        summary: A message defined inline, not via components.
        contentType: application/json
        payload:
          type: object
          properties:
            status:
              type: string

components:
  messages:
    lightMeasured:
      name: lightMeasured
      title: Light measured
      summary: Inform about environmental lighting conditions of a particular streetlight.
      contentType: application/json
      payload:
        \$ref: '#/components/schemas/lightMeasuredPayload'
      headers:
        type: object
        properties:
          my-app-header:
            type: integer
            minimum: 0
            maximum: 100
      bindings:
        kafka:
          key:
            type: string
    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      summary: Command a service to turn on/off the lights.
      contentType: application/json
      payload:
        type: object
        properties:
          command:
            type: string
            enum: [on, off]
          sentAt:
            type: string
            format: date-time
    externalPayloadMessage:
      name: externalPayloadMessage
      title: External Payload Message
      contentType: application/json
      payload:
        \$ref: 'https://example.com/schemas/external.json#/Foo'
  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          minimum: 0
        sentAt:
          type: string
          format: date-time
  parameters:
    streetlightId:
      description: The ID of the streetlight
      schema:
        type: string
  securitySchemes:
    apiKey:
      type: apiKey
      in: user
      description: Provide your API key as the user
    httpApiKey:
      type: httpApiKey
      name: api_key
      in: header
      description: API key via header
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    oauth2:
      type: oauth2
      description: OAuth2 flow
      flows:
        clientCredentials:
          tokenUrl: https://example.com/token
          scopes:
            'streetlights:read': Read streetlight data
`;

/**
 * FIXTURE_V3 — a hand-authored AsyncAPI 3.0.0 document, structurally
 * covering the same domain as FIXTURE_V2 but in 3.x shape: top-level
 * `operations:` referencing channels by $ref, channel-level `messages:`
 * maps (some $ref, one inline for inline-message coverage),
 * `host:`/`pathname:` servers, and 3.x-only reusable
 * components.channels/operations/servers entries.
 */
export const FIXTURE_V3 = `
asyncapi: '3.0.0'
info:
  title: Streetlights API v3
  version: 2.0.0
  description: v3 example
  contact:
    name: API Support
    email: support@asyncapi.org
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  tags:
    - name: streetlights

servers:
  production:
    host: api.streetlights.smartylighting.com:9092
    protocol: kafka
    protocolVersion: '3.2'
    pathname: /kafka
    description: Production Kafka broker
    bindings:
      kafka:
        schemaRegistryUrl: https://schema-registry.example.com
  websocketServer:
    host: ws.streetlights.smartylighting.com
    protocol: ws
    description: WebSocket broker

channels:
  lightMeasured:
    address: light/measured
    title: Light Measured Channel
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        description: streetlight ID
    messages:
      lightMeasuredMessage:
        \$ref: '#/components/messages/lightMeasured'
    bindings:
      kafka:
        topicConfiguration:
          cleanup.policy: [delete]
  turnOn:
    address: light/turn/on
    messages:
      turnOnMessage:
        \$ref: '#/components/messages/turnOnOff'
  inlineStatus:
    address: light/inline/status
    messages:
      inlineStatusMessage:
        name: inlineStatus3
        title: Inline Status v3
        contentType: application/json
        payload:
          type: object
          properties:
            status:
              type: string

operations:
  onLightMeasured:
    action: receive
    channel:
      \$ref: '#/channels/lightMeasured'
    title: Receive light measurement
    summary: Inform about environmental lighting conditions.
    description: Receives light measurement events.
    messages:
      - \$ref: '#/channels/lightMeasured/messages/lightMeasuredMessage'
    bindings:
      kafka:
        groupId: light-measured-group
  turnOnOperation:
    action: send
    channel:
      \$ref: '#/channels/turnOn'
    summary: Command a service to turn on the lights.
    messages:
      - \$ref: '#/channels/turnOn/messages/turnOnMessage'
  publishInlineStatus:
    action: send
    channel:
      \$ref: '#/channels/inlineStatus'
    summary: Publish inline status.
    messages:
      - \$ref: '#/channels/inlineStatus/messages/inlineStatusMessage'

components:
  messages:
    lightMeasured:
      name: lightMeasured
      title: Light measured
      summary: Inform about environmental lighting conditions of a particular streetlight.
      contentType: application/json
      payload:
        \$ref: '#/components/schemas/lightMeasuredPayload'
      headers:
        type: object
        properties:
          my-app-header:
            type: integer
      bindings:
        kafka:
          key:
            type: string
    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      contentType: application/json
      payload:
        type: object
        properties:
          command:
            type: string
            enum: [on, off]
  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          minimum: 0
  securitySchemes:
    apiKey:
      type: apiKey
      in: user
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  parameters:
    streetlightId:
      description: streetlight id v3
  channels:
    reusableChannel:
      address: reusable/chan
  operations:
    reusableOperation:
      action: send
      channel:
        \$ref: '#/channels/turnOn'
  servers:
    reusableServer:
      host: reused.example.com
      protocol: mqtt
`;

/** Minimal valid 2.x document — for tests that just need "a document that
 * parses cleanly and validates". */
export const MINIMAL_V2 = `
asyncapi: '2.6.0'
info:
  title: Minimal
  version: 1.0.0
channels: {}
`;

/** Minimal valid 3.x document. */
export const MINIMAL_V3 = `
asyncapi: '3.0.0'
info:
  title: Minimal
  version: 1.0.0
channels: {}
`;

/** Deliberately missing required fields (no info.title, no info.version,
 * unrecognized asyncapi version) — for ValidateDocument tests. */
export const INVALID_DOC = `
asyncapi: '1.2.0'
info: {}
channels: {}
`;

/** No asyncapi:, no info:, no channels: at all. */
export const EMPTY_DOC = `
foo: bar
`;

export const NOT_A_MAPPING_DOC = `- just
- a
- list
`;

export const UNPARSEABLE_YAML = `
asyncapi: '2.6.0'
info:
   title: x
  version: bad-indent
`;

export const ORACLE_V2_CHANNEL_NAMES = ['light/measured', 'light/turn/on', 'light/inline/status'];
export const ORACLE_V3_CHANNEL_NAMES = ['lightMeasured', 'turnOn', 'inlineStatus'];

export const ORACLE_V2_MESSAGE_NAMES = ['lightMeasured', 'turnOnOff', 'externalPayloadMessage', 'inlineStatus'];
export const ORACLE_V3_MESSAGE_NAMES = ['lightMeasured', 'turnOnOff', 'inlineStatus3'];
