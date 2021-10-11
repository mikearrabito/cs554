import { Typography, List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";

const SeriesDetails = (props) => {
  const { info } = props;

  return (
    <div>
      {info.description && (
        <Typography style={{ marginTop: "6px", marginBottom: "6px" }}>
          {info.description.replace(/<\/?[^>]+(>|$)/g, "")}
        </Typography>
      )}
      {info.characters?.items?.length > 0 && (
        <div style={{ marginTop: "6px" }}>
          <Typography variant="h2" style={{ fontSize: "2rem" }}>
            Characters
          </Typography>
          <List>
            {info.characters.items.map((char) => {
              return (
                <ListItem key={char.resourceURI}>
                  <Link
                    to={`/characters/${
                      char.resourceURI.split("/")[
                        char.resourceURI.split("/").length - 1
                      ]
                    }`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    <Typography>{char.name}</Typography>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </div>
      )}
      {info.comics?.items?.length > 0 && (
        <div style={{ marginTop: "6px" }}>
          <Typography variant="h2" style={{ fontSize: "2rem" }}>
            Comics
          </Typography>
          <List>
            {info.comics.items.map((comic) => {
              return (
                <ListItem key={comic.resourceURI}>
                  <Link
                    to={`/comics/${
                      comic.resourceURI.split("/")[
                        comic.resourceURI.split("/").length - 1
                      ]
                    }`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    <Typography>{comic.name}</Typography>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </div>
      )}
      {info.creators?.items?.length > 0 && (
        <div>
          <Typography
            variant="h2"
            style={{ fontSize: "2rem", marginTop: "6px" }}
          >
            Creators
          </Typography>
          <List>
            {info.creators.items.map((creator) => {
              return (
                <ListItem key={creator.resourceURI}>
                  <Typography>
                    {creator.name}
                    {creator.role &&
                      ", " +
                        creator.role[0].toUpperCase() +
                        creator.role.slice(1)}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </div>
      )}
      {info.stories?.items?.length > 0 && (
        <div style={{ marginTop: "6px" }}>
          <Typography variant="h2" style={{ fontSize: "2rem" }}>
            Stories
          </Typography>
          <List>
            {info.stories.items
              .filter((story) => {
                return !(story.name === "[none]" || story.name.trim() === "");
              })
              .map((story) => {
                return (
                  <ListItem key={story.resourceURI}>
                    <Typography>{story.name}</Typography>
                  </ListItem>
                );
              })}
          </List>
        </div>
      )}
    </div>
  );
};
export default SeriesDetails;
