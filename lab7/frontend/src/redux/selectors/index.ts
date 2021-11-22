import { PokemonDetails, PokemonInfo } from "../../types/Pokemon";

export const trainersListSelector = (state: {
  trainers: { trainersList: string[] };
}) => state.trainers.trainersList;
export const currentTrainerSelector = (state: {
  trainers: { selected: string };
}) => state.trainers.selected;
export const teamsSelector = (state: {
  trainers: { teams: { [trainer: string]: { id: PokemonInfo } } };
}) => state.trainers.teams;
export const pokemonListSelector = (state: {
  pokemon: { currentPage: PokemonInfo[] };
}) => state.pokemon.currentPage;
export const pokemonDetailsSelector = (state: {
  pokemon: { details: PokemonDetails };
}) => state.pokemon.details;
