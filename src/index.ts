import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { myDataSource } from "./data-source";
import { RegisterResolver } from "./modules/user/Register";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login";

const main = async () => {
    // Initialize the Data Source object from TypeORM with the config of the DB
    try {
        await myDataSource.initialize();
        console.log("Datasource has been initialized");
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
    }

    // Build the GraphQL Schema (Type GraphQL)
    const schema = await buildSchema({
        // Register Resolvers
        resolvers: [RegisterResolver, LoginResolver],
    });

    // Instantiate Apollo Server with the builded Schema (Apollo Server Express)
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req }: any) => ({ req }),
    });

    // Run Express
    const app = Express();

    // Add session middleware
    // Pass the express session to redis client
    const RedisStore = connectRedis(session);

    // set cors policy
    app.use(
        cors({
            credentials: true,
            origin: "http://localhost:3000",
        })
    );

    // Pass the session to every route
    app.use(
        session({
            store: new RedisStore({
                client: redis as any,
            }),
            name: "qid",
            secret: "SESSION_SECRET",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
            },
        })
    );

    // Start Apollo Server and apply Express app as middleware
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    // Listen the App on port 4000
    app.listen(4000, () => {
        console.log("Server started on http://localhost:4000/graphql");
    });
};
main();
