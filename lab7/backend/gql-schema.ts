const { gql } = require("apollo-server-core");

// TODO: add abilities to pokemon
// add forms
// add moves
// past types
// held_items
// stats
// types

module.exports = gql`
  type Query {
    getPokemonList(page: Int): [PokemonInfo]!
    getPokemon(id: Int!): Pokemon
  }

  type Pokemon {
    info: PokemonInfo!
    attributes: PokemonAttributes!
  }

  type PokemonInfo {
    id: Int!
    name: String!
    image: String!
  }

  type PokemonAttributes {
    height: Int!
    weight: Int!
    base_experience: Int!
  }
`;
