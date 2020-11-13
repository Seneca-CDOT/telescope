"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerBase = void 0;
const graphql_tools_1 = require("graphql-tools");
const net_1 = require("net");
const tls_1 = require("tls");
const loglevel_1 = __importDefault(require("loglevel"));
const graphql_1 = require("graphql");
const apollo_server_caching_1 = require("apollo-server-caching");
const runtimeSupportsUploads_1 = __importDefault(require("./utils/runtimeSupportsUploads"));
const apollo_server_errors_1 = require("apollo-server-errors");
const index_1 = require("./index");
const playground_1 = require("./playground");
const schemaHash_1 = require("./utils/schemaHash");
const isDirectiveDefined_1 = require("./utils/isDirectiveDefined");
const requestPipeline_1 = require("./requestPipeline");
const apollo_server_env_1 = require("apollo-server-env");
const apollo_tools_1 = require("@apollographql/apollo-tools");
const apollo_tracing_1 = require("apollo-tracing");
const apollo_cache_control_1 = require("apollo-cache-control");
const runHttpQuery_1 = require("./runHttpQuery");
const isNodeLike_1 = __importDefault(require("./utils/isNodeLike"));
const determineApolloConfig_1 = require("./determineApolloConfig");
const plugin_1 = require("./plugin");
const internalPlugin_1 = require("./plugin/internalPlugin");
const NoIntrospection = (context) => ({
    Field(node) {
        if (node.name.value === '__schema' || node.name.value === '__type') {
            context.reportError(new graphql_1.GraphQLError('GraphQL introspection is not allowed by Apollo Server, but the query contained __schema or __type. To enable introspection, pass introspection: true to ApolloServer in production', [node]));
        }
    },
});
const forbidUploadsForTesting = process && process.env.NODE_ENV === 'test' && !runtimeSupportsUploads_1.default;
function approximateObjectSize(obj) {
    return Buffer.byteLength(JSON.stringify(obj), 'utf8');
}
class ApolloServerBase {
    constructor(config) {
        this.graphqlPath = '/graphql';
        this.requestOptions = Object.create(null);
        this.plugins = [];
        this.toDispose = new Set();
        if (!config)
            throw new Error('ApolloServer requires options.');
        this.config = config;
        const { context, resolvers, schema, schemaDirectives, modules, typeDefs, parseOptions = {}, introspection, mocks, mockEntireSchema, extensions, subscriptions, uploads, playground, plugins, gateway, cacheControl, experimental_approximateDocumentStoreMiB, stopOnTerminationSignals, apollo, engine } = config, requestOptions = __rest(config, ["context", "resolvers", "schema", "schemaDirectives", "modules", "typeDefs", "parseOptions", "introspection", "mocks", "mockEntireSchema", "extensions", "subscriptions", "uploads", "playground", "plugins", "gateway", "cacheControl", "experimental_approximateDocumentStoreMiB", "stopOnTerminationSignals", "apollo", "engine"]);
        if (engine !== undefined && apollo) {
            throw new Error('You cannot provide both `engine` and `apollo` to `new ApolloServer()`. ' +
                'For details on how to migrate all of your options out of `engine`, see ' +
                'https://go.apollo.dev/s/migration-engine-plugins');
        }
        if (config.logger) {
            this.logger = config.logger;
        }
        else {
            const loglevelLogger = loglevel_1.default.getLogger("apollo-server");
            if (this.config.debug === true) {
                loglevelLogger.setLevel(loglevel_1.default.levels.DEBUG);
            }
            else {
                loglevelLogger.setLevel(loglevel_1.default.levels.INFO);
            }
            this.logger = loglevelLogger;
        }
        this.apolloConfig = determineApolloConfig_1.determineApolloConfig(apollo, engine, this.logger);
        if (gateway && (modules || schema || typeDefs || resolvers)) {
            throw new Error('Cannot define both `gateway` and any of: `modules`, `schema`, `typeDefs`, or `resolvers`');
        }
        this.parseOptions = parseOptions;
        this.context = context;
        const isDev = process.env.NODE_ENV !== 'production';
        if ((typeof introspection === 'boolean' && !introspection) ||
            (introspection === undefined && !isDev)) {
            const noIntro = [NoIntrospection];
            requestOptions.validationRules = requestOptions.validationRules
                ? requestOptions.validationRules.concat(noIntro)
                : noIntro;
        }
        if (!requestOptions.cache) {
            requestOptions.cache = new apollo_server_caching_1.InMemoryLRUCache();
        }
        if (requestOptions.persistedQueries !== false) {
            const _a = requestOptions.persistedQueries || Object.create(null), { cache: apqCache = requestOptions.cache } = _a, apqOtherOptions = __rest(_a, ["cache"]);
            requestOptions.persistedQueries = Object.assign({ cache: new apollo_server_caching_1.PrefixingKeyValueCache(apqCache, requestPipeline_1.APQ_CACHE_PREFIX) }, apqOtherOptions);
        }
        else {
            delete requestOptions.persistedQueries;
        }
        this.requestOptions = requestOptions;
        if (uploads !== false && !forbidUploadsForTesting) {
            if (this.supportsUploads()) {
                if (!runtimeSupportsUploads_1.default) {
                    printNodeFileUploadsMessage(this.logger);
                    throw new Error('`graphql-upload` is no longer supported on Node.js < v8.5.0.  ' +
                        'See https://bit.ly/gql-upload-node-6.');
                }
                if (uploads === true || typeof uploads === 'undefined') {
                    this.uploadsConfig = {};
                }
                else {
                    this.uploadsConfig = uploads;
                }
            }
            else if (uploads) {
                throw new Error('This implementation of ApolloServer does not support file uploads because the environment cannot accept multi-part forms');
            }
        }
        if (gateway && subscriptions !== false) {
            throw new Error([
                'Subscriptions are not yet compatible with the gateway.',
                "Set `subscriptions: false` in Apollo Server's constructor to",
                'explicitly disable subscriptions (which are on by default)',
                'and allow for gateway functionality.',
            ].join(' '));
        }
        else if (subscriptions !== false) {
            if (this.supportsSubscriptions()) {
                if (subscriptions === true || typeof subscriptions === 'undefined') {
                    this.subscriptionServerOptions = {
                        path: this.graphqlPath,
                    };
                }
                else if (typeof subscriptions === 'string') {
                    this.subscriptionServerOptions = { path: subscriptions };
                }
                else {
                    this.subscriptionServerOptions = Object.assign({ path: this.graphqlPath }, subscriptions);
                }
                this.subscriptionsPath = this.subscriptionServerOptions.path;
            }
            else if (subscriptions) {
                throw new Error('This implementation of ApolloServer does not support GraphQL subscriptions.');
            }
        }
        this.playgroundOptions = playground_1.createPlaygroundOptions(playground);
        const _schema = this.initSchema();
        if (graphql_1.isSchema(_schema)) {
            const derivedData = this.generateSchemaDerivedData(_schema);
            this.schema = derivedData.schema;
            this.schemaDerivedData = Promise.resolve(derivedData);
        }
        else if (typeof _schema.then === 'function') {
            this.schemaDerivedData = _schema.then(schema => this.generateSchemaDerivedData(schema));
        }
        else {
            throw new Error("Unexpected error: Unable to resolve a valid GraphQLSchema.  Please file an issue with a reproduction of this error, if possible.");
        }
        this.ensurePluginInstantiation(plugins);
        if (typeof stopOnTerminationSignals === 'boolean'
            ? stopOnTerminationSignals
            : typeof engine === 'object' &&
                typeof engine.handleSignals === 'boolean'
                ? engine.handleSignals
                : isNodeLike_1.default && process.env.NODE_ENV !== 'test') {
            const signals = ['SIGINT', 'SIGTERM'];
            signals.forEach((signal) => {
                const handler = () => __awaiter(this, void 0, void 0, function* () {
                    yield this.stop();
                    process.kill(process.pid, signal);
                });
                process.once(signal, handler);
                this.toDispose.add(() => {
                    process.removeListener(signal, handler);
                });
            });
        }
    }
    setGraphQLPath(path) {
        this.graphqlPath = path;
    }
    initSchema() {
        const { gateway, schema, modules, typeDefs, resolvers, schemaDirectives, parseOptions, } = this.config;
        if (gateway) {
            this.toDispose.add(gateway.onSchemaChange(schema => (this.schemaDerivedData = Promise.resolve(this.generateSchemaDerivedData(schema)))));
            const engineConfig = this.apolloConfig.keyHash && this.apolloConfig.graphId
                ? {
                    apiKeyHash: this.apolloConfig.keyHash,
                    graphId: this.apolloConfig.graphId,
                    graphVariant: this.apolloConfig.graphVariant,
                }
                : undefined;
            this.requestOptions.executor = gateway.executor;
            return gateway.load({ apollo: this.apolloConfig, engine: engineConfig })
                .then(config => config.schema)
                .catch(err => {
                const message = "This data graph is missing a valid configuration.";
                this.logger.error(message + " " + (err && err.message || err));
                throw new Error(message + " More details may be available in the server logs.");
            });
        }
        let constructedSchema;
        if (schema) {
            constructedSchema = schema;
        }
        else if (modules) {
            const { schema, errors } = apollo_tools_1.buildServiceDefinition(modules);
            if (errors && errors.length > 0) {
                throw new Error(errors.map(error => error.message).join('\n\n'));
            }
            constructedSchema = schema;
        }
        else {
            if (!typeDefs) {
                throw Error('Apollo Server requires either an existing schema, modules or typeDefs');
            }
            const augmentedTypeDefs = Array.isArray(typeDefs) ? typeDefs : [typeDefs];
            if (!isDirectiveDefined_1.isDirectiveDefined(augmentedTypeDefs, 'cacheControl')) {
                augmentedTypeDefs.push(index_1.gql `
            enum CacheControlScope {
              PUBLIC
              PRIVATE
            }

            directive @cacheControl(
              maxAge: Int
              scope: CacheControlScope
            ) on FIELD_DEFINITION | OBJECT | INTERFACE
          `);
            }
            if (this.uploadsConfig) {
                const { GraphQLUpload } = require('graphql-upload');
                if (Array.isArray(resolvers)) {
                    if (resolvers.every(resolver => !resolver.Upload)) {
                        resolvers.push({ Upload: GraphQLUpload });
                    }
                }
                else {
                    if (resolvers && !resolvers.Upload) {
                        resolvers.Upload = GraphQLUpload;
                    }
                }
                augmentedTypeDefs.push(index_1.gql `
            scalar Upload
          `);
            }
            constructedSchema = graphql_tools_1.makeExecutableSchema({
                typeDefs: augmentedTypeDefs,
                schemaDirectives,
                resolvers,
                parseOptions,
            });
        }
        return constructedSchema;
    }
    generateSchemaDerivedData(schema) {
        const schemaHash = schemaHash_1.generateSchemaHash(schema);
        const { mocks, mockEntireSchema, extensions: _extensions } = this.config;
        if (mocks || (typeof mockEntireSchema !== 'undefined' && mocks !== false)) {
            graphql_tools_1.addMockFunctionsToSchema({
                schema,
                mocks: typeof mocks === 'boolean' || typeof mocks === 'undefined'
                    ? {}
                    : mocks,
                preserveResolvers: typeof mockEntireSchema === 'undefined' ? false : !mockEntireSchema,
            });
        }
        const extensions = [];
        extensions.push(...(_extensions || []));
        const documentStore = this.initializeDocumentStore();
        return {
            schema,
            schemaHash,
            extensions,
            documentStore,
        };
    }
    willStart() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var { schema, schemaHash } = yield this.schemaDerivedData;
            }
            catch (err) {
                return;
            }
            const service = {
                logger: this.logger,
                schema: schema,
                schemaHash: schemaHash,
                apollo: this.apolloConfig,
                serverlessFramework: this.serverlessFramework(),
                engine: {
                    serviceID: this.apolloConfig.graphId,
                    apiKeyHash: this.apolloConfig.keyHash,
                },
            };
            if ((_a = this.requestOptions.persistedQueries) === null || _a === void 0 ? void 0 : _a.cache) {
                service.persistedQueries = {
                    cache: this.requestOptions.persistedQueries.cache,
                };
            }
            const serverListeners = (yield Promise.all(this.plugins.map((plugin) => plugin.serverWillStart && plugin.serverWillStart(service)))).filter((maybeServerListener) => typeof maybeServerListener === 'object' &&
                !!maybeServerListener.serverWillStop);
            this.toDispose.add(() => __awaiter(this, void 0, void 0, function* () {
                yield Promise.all(serverListeners.map(({ serverWillStop }) => serverWillStop === null || serverWillStop === void 0 ? void 0 : serverWillStop()));
            }));
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([...this.toDispose].map(dispose => dispose()));
            if (this.subscriptionServer)
                yield this.subscriptionServer.close();
        });
    }
    installSubscriptionHandlers(server) {
        if (!this.subscriptionServerOptions) {
            if (this.config.gateway) {
                throw Error('Subscriptions are not supported when operating as a gateway');
            }
            if (this.supportsSubscriptions()) {
                throw Error('Subscriptions are disabled, due to subscriptions set to false in the ApolloServer constructor');
            }
            else {
                throw Error('Subscriptions are not supported, choose an integration, such as apollo-server-express that allows persistent connections');
            }
        }
        const { SubscriptionServer } = require('subscriptions-transport-ws');
        const { onDisconnect, onConnect, keepAlive, path, } = this.subscriptionServerOptions;
        const schema = this.schema;
        if (this.schema === undefined)
            throw new Error('Schema undefined during creation of subscription server.');
        this.subscriptionServer = SubscriptionServer.create({
            schema,
            execute: graphql_1.execute,
            subscribe: graphql_1.subscribe,
            onConnect: onConnect
                ? onConnect
                : (connectionParams) => (Object.assign({}, connectionParams)),
            onDisconnect: onDisconnect,
            onOperation: (message, connection) => __awaiter(this, void 0, void 0, function* () {
                connection.formatResponse = (value) => (Object.assign(Object.assign({}, value), { errors: value.errors &&
                        apollo_server_errors_1.formatApolloErrors([...value.errors], {
                            formatter: this.requestOptions.formatError,
                            debug: this.requestOptions.debug,
                        }) }));
                connection.formatError = this.requestOptions.formatError;
                let context = this.context ? this.context : { connection };
                try {
                    context =
                        typeof this.context === 'function'
                            ? yield this.context({ connection, payload: message.payload })
                            : context;
                }
                catch (e) {
                    throw apollo_server_errors_1.formatApolloErrors([e], {
                        formatter: this.requestOptions.formatError,
                        debug: this.requestOptions.debug,
                    })[0];
                }
                return Object.assign(Object.assign({}, connection), { context });
            }),
            keepAlive,
            validationRules: this.requestOptions.validationRules
        }, server instanceof net_1.Server || server instanceof tls_1.Server
            ? {
                server,
                path,
            }
            : server);
    }
    supportsSubscriptions() {
        return false;
    }
    supportsUploads() {
        return false;
    }
    serverlessFramework() {
        return false;
    }
    schemaIsFederated(schema) {
        const serviceType = schema.getType('_Service');
        if (!(serviceType && graphql_1.isObjectType(serviceType))) {
            return false;
        }
        const sdlField = serviceType.getFields().sdl;
        if (!sdlField) {
            return false;
        }
        const sdlFieldType = sdlField.type;
        if (!graphql_1.isScalarType(sdlFieldType)) {
            return false;
        }
        return sdlFieldType.name == 'String';
    }
    ensurePluginInstantiation(plugins = []) {
        var _a, _b;
        const pluginsToInit = [];
        if (this.config.tracing) {
            pluginsToInit.push(apollo_tracing_1.plugin());
        }
        if (this.config.cacheControl !== false) {
            let cacheControlOptions = {};
            if (typeof this.config.cacheControl === 'boolean' &&
                this.config.cacheControl === true) {
                cacheControlOptions = {
                    stripFormattedExtensions: false,
                    calculateHttpHeaders: false,
                    defaultMaxAge: 0,
                };
            }
            else {
                cacheControlOptions = Object.assign({ stripFormattedExtensions: true, calculateHttpHeaders: true, defaultMaxAge: 0 }, this.config.cacheControl);
            }
            pluginsToInit.push(apollo_cache_control_1.plugin(cacheControlOptions));
        }
        const federatedSchema = this.schema && this.schemaIsFederated(this.schema);
        pluginsToInit.push(...plugins);
        this.plugins = pluginsToInit.map(plugin => {
            if (typeof plugin === 'function') {
                return plugin();
            }
            return plugin;
        });
        const alreadyHavePluginWithInternalId = (id) => this.plugins.some((p) => internalPlugin_1.pluginIsInternal(p) && p.__internal_plugin_id__() === id);
        {
            const alreadyHavePlugin = alreadyHavePluginWithInternalId('UsageReporting');
            const { engine } = this.config;
            const disabledViaLegacyOption = engine === false ||
                (typeof engine === 'object' && engine.reportTiming === false);
            if (alreadyHavePlugin) {
                if (engine !== undefined) {
                    throw Error("You can't combine the legacy `new ApolloServer({engine})` option with directly " +
                        'creating an ApolloServerPluginUsageReporting plugin. See ' +
                        'https://go.apollo.dev/s/migration-engine-plugins');
                }
            }
            else if (this.apolloConfig.key && !disabledViaLegacyOption) {
                this.plugins.unshift(typeof engine === 'object'
                    ? plugin_1.ApolloServerPluginUsageReportingFromLegacyOptions(engine)
                    : plugin_1.ApolloServerPluginUsageReporting());
            }
        }
        {
            const alreadyHavePlugin = alreadyHavePluginWithInternalId('SchemaReporting');
            const enabledViaEnvVar = process.env.APOLLO_SCHEMA_REPORTING === 'true';
            const { engine } = this.config;
            const enabledViaLegacyOption = typeof engine === 'object' &&
                (engine.reportSchema || engine.experimental_schemaReporting);
            if (alreadyHavePlugin || enabledViaEnvVar || enabledViaLegacyOption) {
                if (federatedSchema) {
                    throw Error([
                        'Schema reporting is not yet compatible with federated services.',
                        "If you're interested in using schema reporting with federated",
                        'services, please contact Apollo support. To set up managed federation, see',
                        'https://go.apollo.dev/s/managed-federation'
                    ].join(' '));
                }
                if (this.config.gateway) {
                    throw new Error([
                        "Schema reporting is not yet compatible with the gateway. If you're",
                        'interested in using schema reporting with the gateway, please',
                        'contact Apollo support. To set up managed federation, see',
                        'https://go.apollo.dev/s/managed-federation'
                    ].join(' '));
                }
            }
            if (alreadyHavePlugin) {
                if (engine !== undefined) {
                    throw Error("You can't combine the legacy `new ApolloServer({engine})` option with directly " +
                        'creating an ApolloServerPluginSchemaReporting plugin. See ' +
                        'https://go.apollo.dev/s/migration-engine-plugins');
                }
            }
            else if (!this.apolloConfig.key) {
                if (enabledViaEnvVar) {
                    throw new Error("You've enabled schema reporting by setting the APOLLO_SCHEMA_REPORTING " +
                        'environment variable to true, but you also need to provide your ' +
                        'Apollo API key, via the APOLLO_KEY environment ' +
                        'variable or via `new ApolloServer({apollo: {key})');
                }
                if (enabledViaLegacyOption) {
                    throw new Error("You've enabled schema reporting in the `engine` argument to `new ApolloServer()`, " +
                        'but you also need to provide your Apollo API key, via the APOLLO_KEY environment ' +
                        'variable or via `new ApolloServer({apollo: {key})');
                }
            }
            else if (enabledViaEnvVar || enabledViaLegacyOption) {
                const options = {};
                if (typeof engine === 'object') {
                    options.initialDelayMaxMs = (_a = engine.schemaReportingInitialDelayMaxMs) !== null && _a !== void 0 ? _a : engine.experimental_schemaReportingInitialDelayMaxMs;
                    options.overrideReportedSchema = (_b = engine.overrideReportedSchema) !== null && _b !== void 0 ? _b : engine.experimental_overrideReportedSchema;
                    options.endpointUrl = engine.schemaReportingUrl;
                }
                this.plugins.push(plugin_1.ApolloServerPluginSchemaReporting(options));
            }
        }
        {
            const alreadyHavePlugin = alreadyHavePluginWithInternalId('InlineTrace');
            const { engine } = this.config;
            if (alreadyHavePlugin) {
                if (engine !== undefined) {
                    throw Error("You can't combine the legacy `new ApolloServer({engine})` option with directly " +
                        'creating an ApolloServerPluginInlineTrace plugin. See ' +
                        'https://go.apollo.dev/s/migration-engine-plugins');
                }
            }
            else if (federatedSchema && this.config.engine !== false) {
                this.logger.info('Enabling inline tracing for this federated service. To disable, use ' +
                    'ApolloServerPluginInlineTraceDisabled.');
                const options = {};
                if (typeof engine === 'object') {
                    options.rewriteError = engine.rewriteError;
                }
                this.plugins.push(plugin_1.ApolloServerPluginInlineTrace(options));
            }
        }
    }
    initializeDocumentStore() {
        return new apollo_server_caching_1.InMemoryLRUCache({
            maxSize: Math.pow(2, 20) *
                (this.experimental_approximateDocumentStoreMiB || 30),
            sizeCalculator: approximateObjectSize,
        });
    }
    graphQLServerOptions(integrationContextArgument) {
        return __awaiter(this, void 0, void 0, function* () {
            const { schema, schemaHash, documentStore, extensions, } = yield this.schemaDerivedData;
            let context = this.context ? this.context : {};
            try {
                context =
                    typeof this.context === 'function'
                        ? yield this.context(integrationContextArgument || {})
                        : context;
            }
            catch (error) {
                context = () => {
                    throw error;
                };
            }
            return Object.assign({ schema,
                schemaHash, logger: this.logger, plugins: this.plugins, documentStore,
                extensions,
                context, persistedQueries: this.requestOptions
                    .persistedQueries, fieldResolver: this.requestOptions.fieldResolver, parseOptions: this.parseOptions }, this.requestOptions);
        });
    }
    executeOperation(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.graphQLServerOptions();
            if (typeof options.context === 'function') {
                options.context = options.context();
            }
            else if (typeof options.context === 'object') {
                options.context = runHttpQuery_1.cloneObject(options.context);
            }
            const requestCtx = {
                logger: this.logger,
                schema: options.schema,
                schemaHash: options.schemaHash,
                request,
                context: options.context || Object.create(null),
                cache: options.cache,
                metrics: {},
                response: {
                    http: {
                        headers: new apollo_server_env_1.Headers(),
                    },
                },
            };
            return requestPipeline_1.processGraphQLRequest(options, requestCtx);
        });
    }
}
exports.ApolloServerBase = ApolloServerBase;
function printNodeFileUploadsMessage(logger) {
    logger.error([
        '*****************************************************************',
        '*                                                               *',
        '* ERROR! Manual intervention is necessary for Node.js < v8.5.0! *',
        '*                                                               *',
        '*****************************************************************',
        '',
        'The third-party `graphql-upload` package, which is used to implement',
        'file uploads in Apollo Server 2.x, no longer supports Node.js LTS',
        'versions prior to Node.js v8.5.0.',
        '',
        'Deployments which NEED file upload capabilities should update to',
        'Node.js >= v8.5.0 to continue using uploads.',
        '',
        'If this server DOES NOT NEED file uploads and wishes to continue',
        'using this version of Node.js, uploads can be disabled by adding:',
        '',
        '  uploads: false,',
        '',
        '...to the options for Apollo Server and re-deploying the server.',
        '',
        'For more information, see https://bit.ly/gql-upload-node-6.',
        '',
    ].join('\n'));
}
//# sourceMappingURL=ApolloServer.js.map