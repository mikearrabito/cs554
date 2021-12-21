import { createAction } from "@reduxjs/toolkit";
import { ADD_TO_TEAM, REMOVE_FROM_TEAM, SET_PAGE } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import {
  currentTrainerSelector,
  pokemonListSelector,
  teamsSelector,
} from "../redux/selectors";
import { PokemonInfo } from "../types/Pokemon";
import { useLazyQuery } from "@apollo/client";
import { getPageQuery } from "../gql/queries";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Pagination,
  Typography,
  LinearProgress,
  Button,
  Grid,
} from "@mui/material";
import PokemonListItem from "./PokemonListItem";

const PokemonList = (props: object) => {
  const params = useParams();
  let page: number = -1;

  if (params.page !== undefined) {
    page = parseInt(params.page);
  }

  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);

  const dispatch = useDispatch();

  const pokemonList = useSelector(pokemonListSelector);
  const selectedTrainer = useSelector(currentTrainerSelector);
  const teams = useSelector(teamsSelector); // gives the team object for the currently selected trainer

  const setCurrentPageList =
    createAction<{ pokemonList: PokemonInfo[] }>(SET_PAGE);
  const addToTeam = createAction<{ pokemonInfo: PokemonInfo }>(ADD_TO_TEAM); // info contains id, name, imageUrl
  const removeFromTeam = createAction<{ pokemonId: number }>(REMOVE_FROM_TEAM); // remove pokemon with given id

  const navigate = useNavigate();

  const [getPage, { loading }] = useLazyQuery(getPageQuery, {
    onCompleted: (data: {
      getPokemonList: {
        pokemonList: PokemonInfo[];
        totalCount: number;
        perPage: number;
      };
    }) => {
      const { pokemonList, perPage, totalCount } = data.getPokemonList;
      setTotalPages(Math.ceil(totalCount / perPage));

      if (pokemonList.length === 0) {
        navigate("/not-found");
      } else {
        dispatch(setCurrentPageList({ pokemonList }));
      }
    },
    onError: () => {
      navigate("/not-found");
    },
  });

  useEffect(() => {
    if (isNaN(currentPage) || currentPage < 0) {
      navigate("/not-found");
    }
    getPage({ variables: { page: currentPage } });
  }, [currentPage, getPage, navigate]);

  return (
    <div>
      {loading ? (
        <div>
          <LinearProgress />
        </div>
      ) : (
        <div>
          {totalPages !== 0 && (
            <Pagination
              hidePrevButton={currentPage === 0}
              hideNextButton={currentPage === totalPages - 1}
              count={totalPages}
              page={currentPage + 1}
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px",
              }}
              size="large"
              onChange={(_, newPage) => {
                setCurrentPage(newPage - 1);
                navigate(`/pokemon/page/${newPage - 1}`);
              }}
            />
          )}
          {selectedTrainer !== "" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography style={{ marginRight: 4 }}>
                Currently selected trainer:
              </Typography>
              <Typography style={{ fontWeight: 600 }}>
                {selectedTrainer}
              </Typography>
            </div>
          ) : (
            <Typography style={{ fontWeight: 600 }}>
              Create a trainer on the trainers page to start catching Pokemon!
            </Typography>
          )}
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            style={{ marginBottom: 30 }}
          >
            {pokemonList.map((pokemonInfo: PokemonInfo) => {
              return (
                <Grid item key={pokemonInfo.id}>
                  <PokemonListItem pokemonInfo={pokemonInfo} link />
                  {selectedTrainer !== "" && (
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                      <Button
                        variant="outlined"
                        onClick={
                          !Object.keys(teams[selectedTrainer]).includes(
                            pokemonInfo.id.toString()
                          )
                            ? () => dispatch(addToTeam({ pokemonInfo }))
                            : () =>
                                dispatch(
                                  removeFromTeam({ pokemonId: pokemonInfo.id })
                                )
                        }
                        disabled={
                          !Object.keys(teams[selectedTrainer]).includes(
                            pokemonInfo.id.toString()
                          ) && Object.keys(teams[selectedTrainer]).length >= 6
                        }
                      >
                        {Object.keys(teams[selectedTrainer]).length < 6 &&
                        !Object.keys(teams[selectedTrainer]).includes(
                          pokemonInfo.id.toString()
                        )
                          ? "Catch"
                          : Object.keys(teams[selectedTrainer]).includes(
                              pokemonInfo.id.toString()
                            )
                          ? "Release"
                          : "Party Full"}
                      </Button>
                    </div>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default PokemonList;
