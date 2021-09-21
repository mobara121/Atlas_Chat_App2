const { ApolloServer } = require('apollo-server-express');

const express = require('express');
const http = require('http');

const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const connectToDB = require('./db');

// The GraphQL schema
const typeDefs = require('./graphql/typeDefs')
// The GraphQL resolvers
const resolvers = require('./graphql/resolvers')
const contextMiddleware = require('./util/contextMiddleware')

connectToDB();

(async function () {
    // Required logic for integrating with Express
    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({
        // typeDefs,
        // resolvers,
        schema,
        context: contextMiddleware,
        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            },
        },
        ApolloServerPluginLandingPageGraphQLPlayground({})
        ],
    });

    const subscriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );

    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
        app,

        // By default, apollo-server hosts its GraphQL endpoint at the
        // server root. However, *other* Apollo Server packages host it at
        // /graphql. Optionally provide this to match apollo-server.
        //  path: '/'
    });

    const PORT = 4000;
    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    );
})();

