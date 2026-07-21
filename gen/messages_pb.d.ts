// package: christiangeorgelucas.asyncapi_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class AsyncApiDocument extends jspb.Message {
  getContent(): string;
  setContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AsyncApiDocument.AsObject;
  static toObject(includeInstance: boolean, msg: AsyncApiDocument): AsyncApiDocument.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AsyncApiDocument, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AsyncApiDocument;
  static deserializeBinaryFromReader(message: AsyncApiDocument, reader: jspb.BinaryReader): AsyncApiDocument;
}

export namespace AsyncApiDocument {
  export type AsObject = {
    content: string,
  }
}

export class MessageRequest extends jspb.Message {
  getContent(): string;
  setContent(value: string): void;

  getMessageName(): string;
  setMessageName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MessageRequest): MessageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageRequest;
  static deserializeBinaryFromReader(message: MessageRequest, reader: jspb.BinaryReader): MessageRequest;
}

export namespace MessageRequest {
  export type AsObject = {
    content: string,
    messageName: string,
  }
}

export class DocViolation extends jspb.Message {
  getPath(): string;
  setPath(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocViolation.AsObject;
  static toObject(includeInstance: boolean, msg: DocViolation): DocViolation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DocViolation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocViolation;
  static deserializeBinaryFromReader(message: DocViolation, reader: jspb.BinaryReader): DocViolation;
}

export namespace DocViolation {
  export type AsObject = {
    path: string,
    message: string,
  }
}

export class DetectVersionOutput extends jspb.Message {
  getMajorVersion(): number;
  setMajorVersion(value: number): void;

  getVersionString(): string;
  setVersionString(value: string): void;

  getParseError(): string;
  setParseError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectVersionOutput.AsObject;
  static toObject(includeInstance: boolean, msg: DetectVersionOutput): DetectVersionOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectVersionOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectVersionOutput;
  static deserializeBinaryFromReader(message: DetectVersionOutput, reader: jspb.BinaryReader): DetectVersionOutput;
}

export namespace DetectVersionOutput {
  export type AsObject = {
    majorVersion: number,
    versionString: string,
    parseError: string,
  }
}

export class ParseDocumentOutput extends jspb.Message {
  getMajorVersion(): number;
  setMajorVersion(value: number): void;

  getVersionString(): string;
  setVersionString(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getApiVersion(): string;
  setApiVersion(value: string): void;

  getServerCount(): number;
  setServerCount(value: number): void;

  getChannelCount(): number;
  setChannelCount(value: number): void;

  getTopLevelOperationCount(): number;
  setTopLevelOperationCount(value: number): void;

  getHasComponents(): boolean;
  setHasComponents(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseDocumentOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ParseDocumentOutput): ParseDocumentOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseDocumentOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseDocumentOutput;
  static deserializeBinaryFromReader(message: ParseDocumentOutput, reader: jspb.BinaryReader): ParseDocumentOutput;
}

export namespace ParseDocumentOutput {
  export type AsObject = {
    majorVersion: number,
    versionString: string,
    title: string,
    apiVersion: string,
    serverCount: number,
    channelCount: number,
    topLevelOperationCount: number,
    hasComponents: boolean,
    error: string,
  }
}

export class ValidateDocumentOutput extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearViolationsList(): void;
  getViolationsList(): Array<DocViolation>;
  setViolationsList(value: Array<DocViolation>): void;
  addViolations(value?: DocViolation, index?: number): DocViolation;

  getMajorVersion(): number;
  setMajorVersion(value: number): void;

  getVersionString(): string;
  setVersionString(value: string): void;

  getParseError(): string;
  setParseError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateDocumentOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateDocumentOutput): ValidateDocumentOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateDocumentOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateDocumentOutput;
  static deserializeBinaryFromReader(message: ValidateDocumentOutput, reader: jspb.BinaryReader): ValidateDocumentOutput;
}

export namespace ValidateDocumentOutput {
  export type AsObject = {
    valid: boolean,
    violationsList: Array<DocViolation.AsObject>,
    majorVersion: number,
    versionString: string,
    parseError: string,
  }
}

export class ExtractInfoOutput extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getTitle(): string;
  setTitle(value: string): void;

  getApiVersion(): string;
  setApiVersion(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getTermsOfService(): string;
  setTermsOfService(value: string): void;

  getContactName(): string;
  setContactName(value: string): void;

  getContactUrl(): string;
  setContactUrl(value: string): void;

  getContactEmail(): string;
  setContactEmail(value: string): void;

  getLicenseName(): string;
  setLicenseName(value: string): void;

  getLicenseUrl(): string;
  setLicenseUrl(value: string): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  getExternalDocsUrl(): string;
  setExternalDocsUrl(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractInfoOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractInfoOutput): ExtractInfoOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractInfoOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractInfoOutput;
  static deserializeBinaryFromReader(message: ExtractInfoOutput, reader: jspb.BinaryReader): ExtractInfoOutput;
}

export namespace ExtractInfoOutput {
  export type AsObject = {
    found: boolean,
    title: string,
    apiVersion: string,
    description: string,
    termsOfService: string,
    contactName: string,
    contactUrl: string,
    contactEmail: string,
    licenseName: string,
    licenseUrl: string,
    tagsList: Array<string>,
    externalDocsUrl: string,
    error: string,
  }
}

export class ChannelSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getAddress(): string;
  setAddress(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  clearMessageNamesList(): void;
  getMessageNamesList(): Array<string>;
  setMessageNamesList(value: Array<string>): void;
  addMessageNames(value: string, index?: number): string;

  getHasPublish(): boolean;
  setHasPublish(value: boolean): void;

  getHasSubscribe(): boolean;
  setHasSubscribe(value: boolean): void;

  clearParameterNamesList(): void;
  getParameterNamesList(): Array<string>;
  setParameterNamesList(value: Array<string>): void;
  addParameterNames(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChannelSummary.AsObject;
  static toObject(includeInstance: boolean, msg: ChannelSummary): ChannelSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChannelSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChannelSummary;
  static deserializeBinaryFromReader(message: ChannelSummary, reader: jspb.BinaryReader): ChannelSummary;
}

export namespace ChannelSummary {
  export type AsObject = {
    name: string,
    address: string,
    description: string,
    messageNamesList: Array<string>,
    hasPublish: boolean,
    hasSubscribe: boolean,
    parameterNamesList: Array<string>,
  }
}

export class ListChannelsOutput extends jspb.Message {
  clearChannelsList(): void;
  getChannelsList(): Array<ChannelSummary>;
  setChannelsList(value: Array<ChannelSummary>): void;
  addChannels(value?: ChannelSummary, index?: number): ChannelSummary;

  getMajorVersion(): number;
  setMajorVersion(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListChannelsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListChannelsOutput): ListChannelsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListChannelsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListChannelsOutput;
  static deserializeBinaryFromReader(message: ListChannelsOutput, reader: jspb.BinaryReader): ListChannelsOutput;
}

export namespace ListChannelsOutput {
  export type AsObject = {
    channelsList: Array<ChannelSummary.AsObject>,
    majorVersion: number,
    error: string,
  }
}

export class OperationSummary extends jspb.Message {
  getOperationId(): string;
  setOperationId(value: string): void;

  getAction(): string;
  setAction(value: string): void;

  getChannel(): string;
  setChannel(value: string): void;

  getSummary(): string;
  setSummary(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  clearMessageNamesList(): void;
  getMessageNamesList(): Array<string>;
  setMessageNamesList(value: Array<string>): void;
  addMessageNames(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperationSummary.AsObject;
  static toObject(includeInstance: boolean, msg: OperationSummary): OperationSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OperationSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperationSummary;
  static deserializeBinaryFromReader(message: OperationSummary, reader: jspb.BinaryReader): OperationSummary;
}

export namespace OperationSummary {
  export type AsObject = {
    operationId: string,
    action: string,
    channel: string,
    summary: string,
    description: string,
    messageNamesList: Array<string>,
  }
}

export class ListOperationsOutput extends jspb.Message {
  clearOperationsList(): void;
  getOperationsList(): Array<OperationSummary>;
  setOperationsList(value: Array<OperationSummary>): void;
  addOperations(value?: OperationSummary, index?: number): OperationSummary;

  getMajorVersion(): number;
  setMajorVersion(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListOperationsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListOperationsOutput): ListOperationsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListOperationsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListOperationsOutput;
  static deserializeBinaryFromReader(message: ListOperationsOutput, reader: jspb.BinaryReader): ListOperationsOutput;
}

export namespace ListOperationsOutput {
  export type AsObject = {
    operationsList: Array<OperationSummary.AsObject>,
    majorVersion: number,
    error: string,
  }
}

export class MessageSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getSummary(): string;
  setSummary(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getContentType(): string;
  setContentType(value: string): void;

  getHasPayload(): boolean;
  setHasPayload(value: boolean): void;

  getHasHeaders(): boolean;
  setHasHeaders(value: boolean): void;

  getSource(): string;
  setSource(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageSummary.AsObject;
  static toObject(includeInstance: boolean, msg: MessageSummary): MessageSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageSummary;
  static deserializeBinaryFromReader(message: MessageSummary, reader: jspb.BinaryReader): MessageSummary;
}

export namespace MessageSummary {
  export type AsObject = {
    name: string,
    title: string,
    summary: string,
    description: string,
    contentType: string,
    hasPayload: boolean,
    hasHeaders: boolean,
    source: string,
  }
}

export class ListMessagesOutput extends jspb.Message {
  clearMessagesList(): void;
  getMessagesList(): Array<MessageSummary>;
  setMessagesList(value: Array<MessageSummary>): void;
  addMessages(value?: MessageSummary, index?: number): MessageSummary;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListMessagesOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListMessagesOutput): ListMessagesOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListMessagesOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListMessagesOutput;
  static deserializeBinaryFromReader(message: ListMessagesOutput, reader: jspb.BinaryReader): ListMessagesOutput;
}

export namespace ListMessagesOutput {
  export type AsObject = {
    messagesList: Array<MessageSummary.AsObject>,
    error: string,
  }
}

export class GetMessagePayloadOutput extends jspb.Message {
  getFound(): boolean;
  setFound(value: boolean): void;

  getPayloadJson(): string;
  setPayloadJson(value: string): void;

  getHeadersJson(): string;
  setHeadersJson(value: string): void;

  getContentType(): string;
  setContentType(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMessagePayloadOutput.AsObject;
  static toObject(includeInstance: boolean, msg: GetMessagePayloadOutput): GetMessagePayloadOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMessagePayloadOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMessagePayloadOutput;
  static deserializeBinaryFromReader(message: GetMessagePayloadOutput, reader: jspb.BinaryReader): GetMessagePayloadOutput;
}

export namespace GetMessagePayloadOutput {
  export type AsObject = {
    found: boolean,
    payloadJson: string,
    headersJson: string,
    contentType: string,
    error: string,
  }
}

export class ServerSummary extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getUrl(): string;
  setUrl(value: string): void;

  getHost(): string;
  setHost(value: string): void;

  getPathname(): string;
  setPathname(value: string): void;

  getProtocol(): string;
  setProtocol(value: string): void;

  getProtocolVersion(): string;
  setProtocolVersion(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerSummary.AsObject;
  static toObject(includeInstance: boolean, msg: ServerSummary): ServerSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerSummary;
  static deserializeBinaryFromReader(message: ServerSummary, reader: jspb.BinaryReader): ServerSummary;
}

export namespace ServerSummary {
  export type AsObject = {
    name: string,
    url: string,
    host: string,
    pathname: string,
    protocol: string,
    protocolVersion: string,
    description: string,
  }
}

export class ListServersOutput extends jspb.Message {
  clearServersList(): void;
  getServersList(): Array<ServerSummary>;
  setServersList(value: Array<ServerSummary>): void;
  addServers(value?: ServerSummary, index?: number): ServerSummary;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListServersOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListServersOutput): ListServersOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListServersOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListServersOutput;
  static deserializeBinaryFromReader(message: ListServersOutput, reader: jspb.BinaryReader): ListServersOutput;
}

export namespace ListServersOutput {
  export type AsObject = {
    serversList: Array<ServerSummary.AsObject>,
    error: string,
  }
}

export class ProtocolCount extends jspb.Message {
  getProtocol(): string;
  setProtocol(value: string): void;

  getServerCount(): number;
  setServerCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProtocolCount.AsObject;
  static toObject(includeInstance: boolean, msg: ProtocolCount): ProtocolCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProtocolCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProtocolCount;
  static deserializeBinaryFromReader(message: ProtocolCount, reader: jspb.BinaryReader): ProtocolCount;
}

export namespace ProtocolCount {
  export type AsObject = {
    protocol: string,
    serverCount: number,
  }
}

export class ExtractProtocolsOutput extends jspb.Message {
  clearProtocolsList(): void;
  getProtocolsList(): Array<ProtocolCount>;
  setProtocolsList(value: Array<ProtocolCount>): void;
  addProtocols(value?: ProtocolCount, index?: number): ProtocolCount;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractProtocolsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractProtocolsOutput): ExtractProtocolsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractProtocolsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractProtocolsOutput;
  static deserializeBinaryFromReader(message: ExtractProtocolsOutput, reader: jspb.BinaryReader): ExtractProtocolsOutput;
}

export namespace ExtractProtocolsOutput {
  export type AsObject = {
    protocolsList: Array<ProtocolCount.AsObject>,
    error: string,
  }
}

export class ExtractComponentsOutput extends jspb.Message {
  clearMessageNamesList(): void;
  getMessageNamesList(): Array<string>;
  setMessageNamesList(value: Array<string>): void;
  addMessageNames(value: string, index?: number): string;

  clearSchemaNamesList(): void;
  getSchemaNamesList(): Array<string>;
  setSchemaNamesList(value: Array<string>): void;
  addSchemaNames(value: string, index?: number): string;

  clearSecuritySchemeNamesList(): void;
  getSecuritySchemeNamesList(): Array<string>;
  setSecuritySchemeNamesList(value: Array<string>): void;
  addSecuritySchemeNames(value: string, index?: number): string;

  clearParameterNamesList(): void;
  getParameterNamesList(): Array<string>;
  setParameterNamesList(value: Array<string>): void;
  addParameterNames(value: string, index?: number): string;

  clearChannelNamesList(): void;
  getChannelNamesList(): Array<string>;
  setChannelNamesList(value: Array<string>): void;
  addChannelNames(value: string, index?: number): string;

  clearOperationNamesList(): void;
  getOperationNamesList(): Array<string>;
  setOperationNamesList(value: Array<string>): void;
  addOperationNames(value: string, index?: number): string;

  clearServerNamesList(): void;
  getServerNamesList(): Array<string>;
  setServerNamesList(value: Array<string>): void;
  addServerNames(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractComponentsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractComponentsOutput): ExtractComponentsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractComponentsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractComponentsOutput;
  static deserializeBinaryFromReader(message: ExtractComponentsOutput, reader: jspb.BinaryReader): ExtractComponentsOutput;
}

export namespace ExtractComponentsOutput {
  export type AsObject = {
    messageNamesList: Array<string>,
    schemaNamesList: Array<string>,
    securitySchemeNamesList: Array<string>,
    parameterNamesList: Array<string>,
    channelNamesList: Array<string>,
    operationNamesList: Array<string>,
    serverNamesList: Array<string>,
    error: string,
  }
}

export class SecuritySchemeInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  getScheme(): string;
  setScheme(value: string): void;

  getBearerFormat(): string;
  setBearerFormat(value: string): void;

  getApiKeyIn(): string;
  setApiKeyIn(value: string): void;

  getApiKeyName(): string;
  setApiKeyName(value: string): void;

  getOauthFlowsJson(): string;
  setOauthFlowsJson(value: string): void;

  getOpenIdConnectUrl(): string;
  setOpenIdConnectUrl(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SecuritySchemeInfo.AsObject;
  static toObject(includeInstance: boolean, msg: SecuritySchemeInfo): SecuritySchemeInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SecuritySchemeInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SecuritySchemeInfo;
  static deserializeBinaryFromReader(message: SecuritySchemeInfo, reader: jspb.BinaryReader): SecuritySchemeInfo;
}

export namespace SecuritySchemeInfo {
  export type AsObject = {
    name: string,
    type: string,
    scheme: string,
    bearerFormat: string,
    apiKeyIn: string,
    apiKeyName: string,
    oauthFlowsJson: string,
    openIdConnectUrl: string,
    description: string,
  }
}

export class ListSecuritySchemesOutput extends jspb.Message {
  clearSchemesList(): void;
  getSchemesList(): Array<SecuritySchemeInfo>;
  setSchemesList(value: Array<SecuritySchemeInfo>): void;
  addSchemes(value?: SecuritySchemeInfo, index?: number): SecuritySchemeInfo;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSecuritySchemesOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ListSecuritySchemesOutput): ListSecuritySchemesOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListSecuritySchemesOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSecuritySchemesOutput;
  static deserializeBinaryFromReader(message: ListSecuritySchemesOutput, reader: jspb.BinaryReader): ListSecuritySchemesOutput;
}

export namespace ListSecuritySchemesOutput {
  export type AsObject = {
    schemesList: Array<SecuritySchemeInfo.AsObject>,
    error: string,
  }
}

export class MessageSchemaRef extends jspb.Message {
  getMessageName(): string;
  setMessageName(value: string): void;

  getPayloadIsRef(): boolean;
  setPayloadIsRef(value: boolean): void;

  getPayloadRef(): string;
  setPayloadRef(value: string): void;

  getRefIsExternal(): boolean;
  setRefIsExternal(value: boolean): void;

  getResolvedSchemaJson(): string;
  setResolvedSchemaJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageSchemaRef.AsObject;
  static toObject(includeInstance: boolean, msg: MessageSchemaRef): MessageSchemaRef.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageSchemaRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageSchemaRef;
  static deserializeBinaryFromReader(message: MessageSchemaRef, reader: jspb.BinaryReader): MessageSchemaRef;
}

export namespace MessageSchemaRef {
  export type AsObject = {
    messageName: string,
    payloadIsRef: boolean,
    payloadRef: string,
    refIsExternal: boolean,
    resolvedSchemaJson: string,
  }
}

export class ExtractMessageSchemasOutput extends jspb.Message {
  clearSchemasList(): void;
  getSchemasList(): Array<MessageSchemaRef>;
  setSchemasList(value: Array<MessageSchemaRef>): void;
  addSchemas(value?: MessageSchemaRef, index?: number): MessageSchemaRef;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractMessageSchemasOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractMessageSchemasOutput): ExtractMessageSchemasOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractMessageSchemasOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractMessageSchemasOutput;
  static deserializeBinaryFromReader(message: ExtractMessageSchemasOutput, reader: jspb.BinaryReader): ExtractMessageSchemasOutput;
}

export namespace ExtractMessageSchemasOutput {
  export type AsObject = {
    schemasList: Array<MessageSchemaRef.AsObject>,
    error: string,
  }
}

export class BindingEntry extends jspb.Message {
  getScopeName(): string;
  setScopeName(value: string): void;

  getProtocol(): string;
  setProtocol(value: string): void;

  getBindingsJson(): string;
  setBindingsJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BindingEntry.AsObject;
  static toObject(includeInstance: boolean, msg: BindingEntry): BindingEntry.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BindingEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BindingEntry;
  static deserializeBinaryFromReader(message: BindingEntry, reader: jspb.BinaryReader): BindingEntry;
}

export namespace BindingEntry {
  export type AsObject = {
    scopeName: string,
    protocol: string,
    bindingsJson: string,
  }
}

export class ExtractServerBindingsOutput extends jspb.Message {
  clearBindingsList(): void;
  getBindingsList(): Array<BindingEntry>;
  setBindingsList(value: Array<BindingEntry>): void;
  addBindings(value?: BindingEntry, index?: number): BindingEntry;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractServerBindingsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractServerBindingsOutput): ExtractServerBindingsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractServerBindingsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractServerBindingsOutput;
  static deserializeBinaryFromReader(message: ExtractServerBindingsOutput, reader: jspb.BinaryReader): ExtractServerBindingsOutput;
}

export namespace ExtractServerBindingsOutput {
  export type AsObject = {
    bindingsList: Array<BindingEntry.AsObject>,
    error: string,
  }
}

export class ExtractOperationBindingsOutput extends jspb.Message {
  clearBindingsList(): void;
  getBindingsList(): Array<BindingEntry>;
  setBindingsList(value: Array<BindingEntry>): void;
  addBindings(value?: BindingEntry, index?: number): BindingEntry;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractOperationBindingsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractOperationBindingsOutput): ExtractOperationBindingsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractOperationBindingsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractOperationBindingsOutput;
  static deserializeBinaryFromReader(message: ExtractOperationBindingsOutput, reader: jspb.BinaryReader): ExtractOperationBindingsOutput;
}

export namespace ExtractOperationBindingsOutput {
  export type AsObject = {
    bindingsList: Array<BindingEntry.AsObject>,
    error: string,
  }
}

export class ExtractMessageBindingsOutput extends jspb.Message {
  clearBindingsList(): void;
  getBindingsList(): Array<BindingEntry>;
  setBindingsList(value: Array<BindingEntry>): void;
  addBindings(value?: BindingEntry, index?: number): BindingEntry;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractMessageBindingsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractMessageBindingsOutput): ExtractMessageBindingsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractMessageBindingsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractMessageBindingsOutput;
  static deserializeBinaryFromReader(message: ExtractMessageBindingsOutput, reader: jspb.BinaryReader): ExtractMessageBindingsOutput;
}

export namespace ExtractMessageBindingsOutput {
  export type AsObject = {
    bindingsList: Array<BindingEntry.AsObject>,
    error: string,
  }
}

export class SummarizeDocumentOutput extends jspb.Message {
  getMajorVersion(): number;
  setMajorVersion(value: number): void;

  getVersionString(): string;
  setVersionString(value: string): void;

  getServerCount(): number;
  setServerCount(value: number): void;

  getChannelCount(): number;
  setChannelCount(value: number): void;

  getOperationCount(): number;
  setOperationCount(value: number): void;

  getMessageCount(): number;
  setMessageCount(value: number): void;

  getSchemaCount(): number;
  setSchemaCount(value: number): void;

  getSecuritySchemeCount(): number;
  setSecuritySchemeCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SummarizeDocumentOutput.AsObject;
  static toObject(includeInstance: boolean, msg: SummarizeDocumentOutput): SummarizeDocumentOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SummarizeDocumentOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SummarizeDocumentOutput;
  static deserializeBinaryFromReader(message: SummarizeDocumentOutput, reader: jspb.BinaryReader): SummarizeDocumentOutput;
}

export namespace SummarizeDocumentOutput {
  export type AsObject = {
    majorVersion: number,
    versionString: string,
    serverCount: number,
    channelCount: number,
    operationCount: number,
    messageCount: number,
    schemaCount: number,
    securitySchemeCount: number,
    error: string,
  }
}

export class ExtractRefsOutput extends jspb.Message {
  clearRefsList(): void;
  getRefsList(): Array<string>;
  setRefsList(value: Array<string>): void;
  addRefs(value: string, index?: number): string;

  clearExternalRefsList(): void;
  getExternalRefsList(): Array<string>;
  setExternalRefsList(value: Array<string>): void;
  addExternalRefs(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractRefsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractRefsOutput): ExtractRefsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractRefsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractRefsOutput;
  static deserializeBinaryFromReader(message: ExtractRefsOutput, reader: jspb.BinaryReader): ExtractRefsOutput;
}

export namespace ExtractRefsOutput {
  export type AsObject = {
    refsList: Array<string>,
    externalRefsList: Array<string>,
    error: string,
  }
}

