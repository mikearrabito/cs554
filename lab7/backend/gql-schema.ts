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
    getPokemonList(page: Int): PokemonPage!
    getPokemon(id: Int!): Pokemon
  }

  type Pokemon {
    info: PokemonInfo!
    attributes: PokemonAttributes!
  }

  type PokemonPage {
    totalCount: Int!
    perPage: Int!
    pokemonList: [PokemonInfo]!
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
