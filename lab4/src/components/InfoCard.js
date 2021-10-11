import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const InfoCard = (props) => {
  const { info, detailed, section } = props;

  return (
    <Card>
      <CardActionArea>
        <Link
          to={`/${section}/${info.id}`}
          style={{ textDecoration: "none", color: "blue" }}
        >
          <CardMedia
            component="img"
            alt={`${info.name} image`}
            height="200"
            image={`${info.thumbnail.path}.${info.thumbnail.extension}`}
            style={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography
              variant="h2"
              align="center"
              style={{ fontSize: "2rem" }}
            >
              {info.name}
            </Typography>
            {detailed && (
              <div
                id={`${section}-details`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>more info here</Typography>
              </div>
            )}
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
};

export default InfoCard;
