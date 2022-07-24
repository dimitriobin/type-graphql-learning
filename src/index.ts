import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { myDataSource } from "./data-source";
import { RegisterResolver } from "./modules/user/Register";

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
        resolvers: [RegisterResolver],
    });

    // Instantiate Apollo Server with the builded Schema (Apollo Server Express)
    const apolloServer = new ApolloServer({ schema });

    // Run Express
    const app = Express();

    // Start Apollo Server and apply Express app as middleware
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    // Listen the App on port 4000
    app.listen(4000, () => {
        console.log("Server started on http://localhost:4000/graphql");
    });
};
main();
