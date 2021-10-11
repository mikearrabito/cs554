import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import CharacterDetails from "../components/CharacterDetails";
import ComicDetails from "./ComicDetails";
import SeriesDetails from "./SeriesDetails";

const InfoCard = (props) => {
  const { info, detailed, section } = props;
  const name = section === "characters" ? info?.name : info?.title;

  return (
    <Card>
      {!detailed ? (
        <Link
          to={`/${section}/${info?.id}`}
          style={{ textDecoration: "none", color: "blue" }}
        >
          <CardMedia
            component="img"
            alt={`${name} image`}
            height="200"
            image={`${info?.thumbnail?.path}.${info?.thumbnail?.extension}`}
            style={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography
              variant="h2"
              align="center"
              style={{ fontSize: "2rem" }}
            >
              {name}
            </Typography>
          </CardContent>
        </Link>
      ) : (
        <>
          <CardMedia
            component="img"
            alt={`${name} image`}
            height="200"
            image={`${info?.thumbnail?.path}.${info?.thumbnail?.extension}`}
            style={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography
              variant="h1"
              align="center"
              style={{ fontSize: "3rem" }}
            >
              {name}
            </Typography>
            <div
              id={`${section}-details`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {section === "characters" && <CharacterDetails info={info} />}
              {section === "comics" && <ComicDetails info={info} />}
              {section === "series" && <SeriesDetails info={info} />}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default InfoCard;
