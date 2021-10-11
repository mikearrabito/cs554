import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";

const StartPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        margin: "10px",
      }}
    >
      <Typography variant="h1">Welcome</Typography>
      <Typography
        variant="h2"
        style={{ fontSize: "2rem", marginBottom: "10px" }}
      >
        On this site you can browse all types of information about Marvel
      </Typography>
      <Typography>
        This site interacts with Marvel's API to get data for all of their
        characters, comics, and series.
      </Typography>
      <Typography>
        For each character, you can see details such as a description and what
        comics and series they are a part of.
      </Typography>
      <Typography>
        Comic's details include a description, price, series, characters,
        creators, and more.
      </Typography>
      <Typography>
        Details for each Series include characters, comics, creators, and more.
      </Typography>
      <Typography style={{ marginTop: "10px" }}>
        Choose a category to explore
      </Typography>
      <div>
        <Button
          component={Link}
          to="/characters/page/0"
          variant="outlined"
          style={{ marginRight: "10px" }}
        >
          Characters
        </Button>
        <Button
          component={Link}
          to="/comics/page/0"
          variant="outlined"
          style={{ marginRight: "10px" }}
        >
          Comics
        </Button>
        <Button component={Link} to="/series/page/0" variant="outlined">
          Series
        </Button>
      </div>
    </div>
  );
};

export default StartPage;
