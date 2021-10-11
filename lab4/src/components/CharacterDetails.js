import { Typography, List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";

const CharacterDetails = (props) => {
  const { info } = props;

  return (
    <div>
      {info.description && (
        <Typography>
          {info.description.replace(/<\/?[^>]+(>|$)/g, "")}
        </Typography>
      )}
      {info.comics?.items?.length && (
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
      {info.series?.items?.length && (
        <div style={{ marginTop: "6px" }}>
          <Typography variant="h2" style={{ fontSize: "2rem" }}>
            Series
          </Typography>
          <List>
            {info.series.items.map((series) => {
              return (
                <ListItem key={series.resourceURI}>
                  <Link
                    to={`/series/${
                      series.resourceURI.split("/")[
                        series.resourceURI.split("/").length - 1
                      ]
                    }`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    <Typography>{series.name}</Typography>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </div>
      )}
      {info.stories?.items?.length && (
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
export default CharacterDetails;
