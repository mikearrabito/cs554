import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { PokemonInfo } from "../types/Pokemon";
import notFound from "../images/notFound.png";

const PokemonListItem = (props: {
  pokemonInfo: PokemonInfo;
  link?: boolean;
}) => {
  const { pokemonInfo, link } = props;

  const data = () => {
    return (
      <>
        <img
          alt={pokemonInfo.name}
          src={pokemonInfo.image}
          width={200}
          height={200}
          onError={(e) => ((e.target as HTMLImageElement).src = notFound)}
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
