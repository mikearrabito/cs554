import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function CharacterCard(props) {
  const { charInfo } = props;

  return (
    <Card>
      <CardActionArea>
        <Link
          to={`/characters/${charInfo.id}`}
          style={{ textDecoration: "none", color: "blue" }}
        >
          <CardMedia
            component="img"
            alt={`${charInfo.name} image`}
            height="200"
            image={`${charInfo.thumbnail.path}.${charInfo.thumbnail.extension}`}
            style={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography
              variant="h2"
              align="center"
              style={{ fontSize: "2rem" }}
            >
              {charInfo.name}
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
}
