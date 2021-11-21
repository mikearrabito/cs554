import { gql } from "@apollo/client";

export const getPageQuery = gql`
  query getPage($page: Int) {
    getPokemonList(page: $page) {
      id
      name
      image
    }
  }
`;

export const getPokemonQuery = gql`
  query getPokemon($id: Int!) {
    getPokemon(id: $id) {
      info {
        id
        image
        name
      }
      attributes {
        base_experience
        height
        weight
      }
    }
  }
`;
