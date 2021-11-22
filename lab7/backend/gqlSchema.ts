const { gql } = require("apollo-server-core");

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

  type PokemonStats {
    hp: Int!
    attack: Int!
    defense: Int!
    specialAttack: Int!
    specialDefense: Int!
    speed: Int!
  }

  type PokemonAttributes {
    height: Int!
    weight: Int!
    base_experience: Int!
    types: [String!]!
    stats: PokemonStats!
    abilities: [String!]!
    moves: [String!]!
  }
`;
