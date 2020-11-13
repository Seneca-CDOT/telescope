import { GraphQLError, DocumentNode } from 'graphql';
import { GraphQLRequestContextDidResolveOperation, GraphQLRequestContextDidEncounterErrors, Logger, GraphQLRequestContext } from 'apollo-server-types';
import { RequestAgent } from 'apollo-server-env';
export interface ApolloServerPluginUsageReportingOptions<TContext> {
    sendVariableValues?: VariableValueOptions;
    sendHeaders?: SendValuesBaseOptions;
    rewriteError?: (err: GraphQLError) => GraphQLError | null;
    includeRequest?: (request: GraphQLRequestContextDidResolveOperation<TContext> | GraphQLRequestContextDidEncounterErrors<TContext>) => Promise<boolean>;
    generateClientInfo?: GenerateClientInfo<TContext>;
    overrideReportedSchema?: string;
    sendUnexecutableOperationDocuments?: boolean;
    sendReportsImmediately?: boolean;
    requestAgent?: RequestAgent | false;
    reportIntervalMs?: number;
    maxUncompressedReportSize?: number;
    maxAttempts?: number;
    minimumRetryDelayMs?: number;
    logger?: Logger;
    reportErrorFunction?: (err: Error) => void;
    endpointUrl?: string;
    debugPrintReports?: boolean;
    calculateSignature?: (ast: DocumentNode, operationName: string) => string;
}
export declare type SendValuesBaseOptions = {
    onlyNames: Array<String>;
} | {
    exceptNames: Array<String>;
} | {
    all: true;
} | {
    none: true;
};
declare type VariableValueTransformOptions = {
    variables: Record<string, any>;
    operationString?: string;
};
export declare type VariableValueOptions = {
    transform: (options: VariableValueTransformOptions) => Record<string, any>;
} | SendValuesBaseOptions;
export interface ClientInfo {
    clientName?: string;
    clientVersion?: string;
    clientReferenceId?: string;
}
export declare type GenerateClientInfo<TContext> = (requestContext: GraphQLRequestContext<TContext>) => ClientInfo;
export {};
//# sourceMappingURL=options.d.ts.map