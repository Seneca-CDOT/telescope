/// <reference types="node" />
import { Server as HttpServer } from 'http';
import { Http2Server, Http2SecureServer } from 'http2';
import { Server as HttpsServer } from 'https';
import { GraphQLSchema } from 'graphql';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import WebSocket from 'ws';
import { GraphQLServerOptions } from './graphqlOptions';
import { Config, SubscriptionServerOptions, FileUploadOptions } from './types';
import { PlaygroundRenderPageOptions } from './playground';
import { GraphQLRequest } from './requestPipeline';
export declare class ApolloServerBase {
    private logger;
    subscriptionsPath?: string;
    graphqlPath: string;
    requestOptions: Partial<GraphQLServerOptions<any>>;
    private context?;
    private apolloConfig;
    protected plugins: ApolloServerPlugin[];
    protected subscriptionServerOptions?: SubscriptionServerOptions;
    protected uploadsConfig?: FileUploadOptions;
    private subscriptionServer?;
    protected playgroundOptions?: PlaygroundRenderPageOptions;
    private parseOptions;
    private schemaDerivedData;
    private config;
    protected schema?: GraphQLSchema;
    private toDispose;
    private experimental_approximateDocumentStoreMiB;
    constructor(config: Config);
    setGraphQLPath(path: string): void;
    private initSchema;
    private generateSchemaDerivedData;
    protected willStart(): Promise<void>;
    stop(): Promise<void>;
    installSubscriptionHandlers(server: HttpServer | HttpsServer | Http2Server | Http2SecureServer | WebSocket.Server): void;
    protected supportsSubscriptions(): boolean;
    protected supportsUploads(): boolean;
    protected serverlessFramework(): boolean;
    private schemaIsFederated;
    private ensurePluginInstantiation;
    private initializeDocumentStore;
    protected graphQLServerOptions(integrationContextArgument?: Record<string, any>): Promise<GraphQLServerOptions>;
    executeOperation(request: GraphQLRequest): Promise<import("apollo-server-types").GraphQLResponse>;
}
//# sourceMappingURL=ApolloServer.d.ts.map