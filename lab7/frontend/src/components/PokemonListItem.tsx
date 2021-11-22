import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { PokemonInfo } from "../types/Pokemon";
import notFound from "../images/notFound.png";
import { useState } from "react";

const PokemonListItem = (props: {
  pokemonInfo: PokemonInfo;
  link?: boolean;
}) => {
  const { pokemonInfo, link } = props;
  const [imageError, setImageError] = useState(false);

  const data = () => {
    return (
      <>
        <img
          alt={pokemonInfo.name}
          src={pokemonInfo.image}
          width={200}
          height={200}
          onError={(event) => {
            if (!imageError) {
              // imageError flag prevents infinite loop if the notFound image has an error as well
              (event.target as HTMLImageElement).src = notFound;
              setImageError(true);
            }
          }}
        />
        <Typography>{pokemonInfo.name}</Typography>
      </>
    );
  };
  if (link) {
    return <Link to={`/pokemon/${pokemonInfo.id}`}>{data()}</Link>;
  }
  return data();
};

export default PokemonListItem;
