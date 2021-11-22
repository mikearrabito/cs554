const { ApolloServer } = require("apollo-server");
const typeDefs = require("./gqlSchema");
const resolvers = require("./gqlResolvers");

const startApollo = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen();
  console.log(`Apollo server running at ${url}`);
};

startApollo();
