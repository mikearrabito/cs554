import { Typography } from "@mui/material";

const MainPage = () => {
  return (
    <div style={{ margin: 20 }}>
      <Typography
        variant="h1"
        style={{ fontSize: "3.2rem", marginBottom: "10px" }}
      >
        Welcome!
      </Typography>
      <Typography
        variant="h2"
        style={{ fontSize: "2rem", marginBottom: "10px" }}
      >
        This App allows you to create Pokemon trainers and catch Pokemon
      </Typography>
      <Typography>
        Access the trainers page first to create your first trainer, then browse
        the list of Pokemon to find some to catch!
      </Typography>
      <Typography>
        A single trainer can only have 6 Pokemon at a time, so you must either
        remove one to catch more, or create and select a new trainer.
      </Typography>
    </div>
  );
};
export default MainPage;
