import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { SET_DETAILS, ADD_TO_TEAM, REMOVE_FROM_TEAM } from "../redux/actions";
import { getPokemonQuery } from "../gql/queries";
import { createAction } from "@reduxjs/toolkit";
import { PokemonDetails, PokemonStats, PokemonInfo } from "../types/Pokemon";
import { useEffect } from "react";
import {
  currentTrainerSelector,
  pokemonDetailsSelector,
  teamsSelector,
} from "../redux/selectors";
import {
  LinearProgress,
  Typography,
  List,
  ListItem,
  Button,
} from "@mui/material";
import PokemonListItem from "./PokemonListItem";

const PokemonDetailsPage = () => {
  const params = useParams();
  let pokemonIdParam: number = -1;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setDetails = createAction<{ details: PokemonDetails }>(SET_DETAILS);
  const addToTeam = createAction<{ pokemonInfo: PokemonInfo }>(ADD_TO_TEAM); // info contains id, name, imageUrl
  const removeFromTeam = createAction<{ pokemonId: number }>(REMOVE_FROM_TEAM); // remove pokemon with given id

  const pokemonDetails = useSelector(pokemonDetailsSelector);
  const selectedTrainer = useSelector(currentTrainerSelector);
  const teams = useSelector(teamsSelector);

  const [getDetails, { loading }] = useLazyQuery(getPokemonQuery, {
    onCompleted: (data: { getPokemon: PokemonDetails | null }) => {
      if (data.getPokemon === null) {
        // backend responds with null if no data found for this id
        navigate("/not-found");
        return;
      }
      dispatch(setDetails({ details: data.getPokemon }));
    },
    onError: () => {
      navigate("/not-found");
    },
  });

  useEffect(() => {
    // validate id is number >= 0 before sending request to get pokemon details
    if (isNaN(pokemonIdParam) || pokemonIdParam < 0) {
      navigate("/not-found");
      return;
    }
    getDetails({ variables: { id: pokemonIdParam } });
  }, [getDetails, navigate, pokemonIdParam]);

  if (params.id !== undefined) {
    pokemonIdParam = parseInt(params.id);
  }

  const isUpperCase = (char: string): boolean => {
    return char === char.toUpperCase();
  };

  const convertFromCamelCase = (camelCaseString: string): string => {
    // converts from camel case string to capitalized space separated string
    // specialAttack -> Special Attack, attack -> Attack
    let newString = camelCaseString.charAt(0).toUpperCase();
    for (let index = 1; index < camelCaseString.length; index++) {
      let currentChar = camelCaseString.charAt(index);
      if (isUpperCase(currentChar)) {
        newString += " ";
      }
      newString += currentChar;
    }
    return newString;
  };

  return (
    <div style={{ marginBottom: 30 }}>
      {loading ? (
        <LinearProgress />
      ) : (
        pokemonDetails.info && (
          <div>
            <Typography variant="h1" style={{ marginTop: 10 }}>
              Details
            </Typography>
            <PokemonListItem pokemonInfo={pokemonDetails.info} />
            {selectedTrainer !== "" ? (
              <Button
                variant="outlined"
                onClick={
                  !Object.keys(teams[selectedTrainer]).includes(
                    pokemonDetails.info.id.toString()
                  )
                    ? () =>
                        dispatch(
                          addToTeam({ pokemonInfo: pokemonDetails.info })
                        )
                    : () =>
                        dispatch(
                          removeFromTeam({
                            pokemonId: pokemonDetails.info.id,
                          })
                        )
                }
                disabled={
                  !Object.keys(teams[selectedTrainer]).includes(
                    pokemonDetails.info.id.toString()
                  ) && Object.keys(teams[selectedTrainer]).length >= 6
                }
              >
                {Object.keys(teams[selectedTrainer]).length < 6 &&
                !Object.keys(teams[selectedTrainer]).includes(
                  pokemonDetails.info.id.toString()
                ) ? (
                  <Typography>Catch</Typography>
                ) : Object.keys(teams[selectedTrainer]).includes(
                    pokemonDetails.info.id.toString()
                  ) ? (
                  <Typography>Release</Typography>
                ) : (
                  <Typography>Party Full</Typography>
                )}
              </Button>
            ) : (
              <Typography style={{ fontWeight: 600 }}>
                Create a trainer to be able to catch this Pokemon!
              </Typography>
            )}
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {pokemonDetails?.attributes?.types &&
                pokemonDetails.attributes.types.length && (
                  <div style={{ marginBottom: 10 }}>
                    <Typography variant="h2">Types</Typography>
                    <List dense disablePadding>
                      {pokemonDetails.attributes.types.map((type) => {
                        return (
                          <ListItem
                            key={type}
                            style={{ justifyContent: "center" }}
                          >
                            <Typography>{type}</Typography>
                          </ListItem>
                        );
                      })}
                    </List>
                  </div>
                )}
              {pokemonDetails.attributes.stats && (
                <>
                  <Typography variant="h2">Stats</Typography>
                  {(
                    Object.keys(pokemonDetails.attributes.stats) as Array<
                      keyof PokemonStats | "__typename"
                    >
                  )
                    .filter((typeName) => typeName !== "__typename")
                    .map((key: string) => {
                      return (
                        <Typography key={key}>
                          {convertFromCamelCase(key)}:{" "}
                          {
                            pokemonDetails.attributes.stats[
                              key as keyof PokemonStats
                            ]
                          }
                        </Typography>
                      );
                    })}
                </>
              )}
              {pokemonDetails.attributes.abilities.length && (
                <>
                  <Typography variant="h2">Abilities</Typography>
                  {pokemonDetails.attributes.abilities.map((ability) => {
                    return <Typography key={ability}>{ability}</Typography>;
                  })}
                </>
              )}
              {pokemonDetails.attributes.moves.length && (
                <>
                  <Typography variant="h2">Moves</Typography>
                  <List
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      maxHeight: "300px",
                      maxWidth: "600px",
                      overflow: "auto",
                    }}
                  >
                    {pokemonDetails.attributes.moves.map((move) => {
                      return (
                        <ListItem key={move}>
                          <Typography>{convertFromCamelCase(move)}</Typography>
                        </ListItem>
                      );
                    })}
                  </List>
                </>
              )}
              <Typography variant="h2">Other Data</Typography>
              <Typography>
                Height: {pokemonDetails.attributes.height} decimetres
              </Typography>
              <Typography>
                Weight: {pokemonDetails.attributes.weight} hectograms
              </Typography>
              <Typography>
                Experience gained for defeating this Pokemon:{" "}
                {pokemonDetails.attributes.base_experience}
              </Typography>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PokemonDetailsPage;
