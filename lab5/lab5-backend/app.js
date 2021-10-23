require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const typeDefs = require("./gql-schema");
const resolvers = require("./gql-resolvers");

const startApollo = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen();
  console.log(`Apollo server running at ${url}`);
};

startApollo();
