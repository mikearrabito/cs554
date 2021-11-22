export interface PokemonInfo {
  id: number;
  name: string;
  image: string;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonAttributes {
  height: number;
  weight: number;
  base_experience: number;
  types: string[];
  stats: PokemonStats;
  abilities: string[];
  moves: string[];
}

export interface PokemonDetails {
  info: PokemonInfo;
  attributes: PokemonAttributes;
}
