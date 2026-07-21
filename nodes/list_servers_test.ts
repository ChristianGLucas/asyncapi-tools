import { AsyncApiDocument } from '../gen/messages_pb';
import { listServers } from './list_servers';
import { ctx, FIXTURE_V2, FIXTURE_V3 } from './testkit';

describe('ListServers', () => {
  it('lists 2.x servers with url verbatim and empty host/pathname', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V2);
    const result = listServers(ctx, input);
    const servers = result.getServersList();
    expect(servers.map((s) => s.getName())).toEqual(['production', 'staging']);

    const production = servers[0];
    expect(production.getUrl()).toBe('api.streetlights.smartylighting.com:9092');
    expect(production.getHost()).toBe('');
    expect(production.getPathname()).toBe('');
    expect(production.getProtocol()).toBe('kafka');
    expect(production.getProtocolVersion()).toBe('3.2');
    expect(production.getDescription()).toBe('Production Kafka broker');

    const staging = servers[1];
    expect(staging.getProtocol()).toBe('mqtt');
  });

  it('lists 3.x servers with url normalized from host+pathname', () => {
    const input = new AsyncApiDocument();
    input.setContent(FIXTURE_V3);
    const result = listServers(ctx, input);
    const servers = result.getServersList();
    expect(servers.map((s) => s.getName())).toEqual(['production', 'websocketServer']);

    const production = servers[0];
    expect(production.getHost()).toBe('api.streetlights.smartylighting.com:9092');
    expect(production.getPathname()).toBe('/kafka');
    expect(production.getUrl()).toBe('api.streetlights.smartylighting.com:9092/kafka');
    expect(production.getProtocol()).toBe('kafka');

    const ws = servers[1];
    expect(ws.getHost()).toBe('ws.streetlights.smartylighting.com');
    expect(ws.getPathname()).toBe('');
    expect(ws.getUrl()).toBe('ws.streetlights.smartylighting.com');
    expect(ws.getProtocol()).toBe('ws');
  });

  it('returns an empty list, never a crash, when servers: is absent', () => {
    const input = new AsyncApiDocument();
    input.setContent("asyncapi: '2.6.0'\ninfo:\n  title: X\n  version: '1.0.0'\nchannels: {}\n");
    const result = listServers(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getServersList()).toHaveLength(0);
  });
});
