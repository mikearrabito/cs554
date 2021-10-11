import { Typography, List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";

const ComicDetails = (props) => {
  const { info } = props;
  let seriesUri = info.series?.resourceURI;
  let printPrice = 0;

  if (seriesUri !== undefined) {
    seriesUri = seriesUri.split("/");
    seriesUri = seriesUri[seriesUri.length - 1];
  }

  if (info.prices?.length) {
    for (const price of info.prices) {
      if (price.type === "printPrice") {
        printPrice = price.price;
        break;
      }
    }
  }

  return (
    <div>
      {info.description && (
        <Typography style={{ marginTop: "6px", marginBottom: "6px" }}>
          {info.description.replace(/<\/?[^>]+(>|$)/g, "")}
        </Typography>
      )}
      {info.pageCount > 0 && (
        <Typography>Page count: {info.pageCount}</Typography>
      )}
      {printPrice !== 0 && <Typography>Price: ${printPrice}</Typography>}
      {info.series?.name && (
        <div>
          <Typography
            variant="h2"
            style={{ fontSize: "2rem", marginTop: "6px", marginBottom: "4px" }}
          >
            Series
          </Typography>
          <List>
            <ListItem>
              <Link
                to={`/series/${seriesUri}`}
                style={{ textDecoration: "none", color: "blue" }}
              >
                <Typography>{info.series.name}</Typography>
              </Link>
            </ListItem>
          </List>
        </div>
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
      {info.collectedIssues?.length > 0 && (
        <div>
          <Typography
            variant="h2"
            style={{ fontSize: "2rem", marginTop: "6px" }}
          >
            Collected Issues
          </Typography>
          <List>
            {info.collectedIssues.map((item) => {
              return (
                <ListItem key={item.resourceURI}>
                  <Link
                    to={`/comics/${
                      item.resourceURI.split("/")[
                        item.resourceURI.split("/").length - 1
                      ]
                    }`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    {item.name}
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

export default ComicDetails;
