import { useDispatch, useSelector } from "react-redux";
import { ADD_TRAINER, REMOVE_TRAINER, SELECT_TRAINER } from "../redux/actions";
import { createAction } from "@reduxjs/toolkit";
import {
  currentTrainerSelector,
  teamsSelector,
  trainersListSelector,
} from "../redux/selectors";
import { TextField, Typography, Button, Grid } from "@mui/material";
import { useState } from "react";
import { PokemonInfo } from "../types/Pokemon";
import PokemonListItem from "./PokemonListItem";

const Trainers = () => {
  const dispatch = useDispatch();

  const trainersList = useSelector(trainersListSelector);
  const selectedTrainer = useSelector(currentTrainerSelector);
  const teams = useSelector(teamsSelector);

  const addTrainer = createAction<{ trainer: string }>(ADD_TRAINER);
  const deleteTrainer = createAction<{ trainer: string }>(REMOVE_TRAINER);
  const selectTrainer = createAction<{ trainer: string }>(SELECT_TRAINER);

  const [newTrainerName, setNewTrainerName] = useState("");

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTrainerName.trim() !== "") {
      dispatch(addTrainer({ trainer: newTrainerName.trim() }));
    }
    setNewTrainerName("");
  };

  return (
    <div>
      <div style={{ margin: 14 }}>
        <form onSubmit={formSubmit}>
          <TextField
            label="Add a Trainer"
            variant="outlined"
            value={newTrainerName}
            onChange={(e) => setNewTrainerName(e.target.value)}
          />
        </form>
      </div>
      <Typography variant="h1" style={{ fontSize: "3rem", marginBottom: 10 }}>
        Current Trainers
      </Typography>
      <div>
        {trainersList.length === 0 && (
          <Typography variant="h2" style={{ fontSize: "2rem", marginTop: 10 }}>
            No trainers created yet!
          </Typography>
        )}
        {trainersList.map((trainer) => {
          return (
            <div
              key={trainer}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <Typography style={{ fontWeight: 600, marginRight: 10 }}>
                  Trainer: {trainer}
                </Typography>
                {selectedTrainer === trainer && (
                  <Typography
                    color="primary"
                    style={{ marginRight: 4, fontWeight: 700 }}
                  >
                    Currently Selected
                  </Typography>
                )}
                {selectedTrainer !== trainer && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => dispatch(selectTrainer({ trainer }))}
                      style={{ marginRight: 20 }}
                    >
                      Select Trainer
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => dispatch(deleteTrainer({ trainer }))}
                    >
                      Delete Trainer
                    </Button>
                  </>
                )}
              </div>
              {Object.keys(teams[trainer]).length ? (
                <Grid
                  container
                  spacing={4}
                  justifyContent="center"
                  alignItems="center"
                >
                  {Object.values(teams[trainer]).map(
                    (pokemonInfo: PokemonInfo) => {
                      return (
                        <Grid item key={pokemonInfo.id}>
                          <PokemonListItem pokemonInfo={pokemonInfo} link />
                        </Grid>
                      );
                    }
                  )}
                </Grid>
              ) : (
                <Typography>No Pokemon caught by this trainer yet!</Typography>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Trainers;
