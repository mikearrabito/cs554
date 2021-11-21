import { createAction } from "@reduxjs/toolkit";
import { SET_PAGE } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { pokemonListSelector } from "../redux/selectors";
import { PokemonInfo } from "../types/Pokemon";
import { useLazyQuery } from "@apollo/client";
import { getPageQuery } from "../gql/queries";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import notFound from "../images/notFound.png";

const PokemonList = (props: object) => {
  const params = useParams();
  let page: number = -1;

  if (params.page !== undefined) {
    page = parseInt(params.page);
  }

  const [currentPage, setCurrentPage] = useState(page);
  const dispatch = useDispatch();
  const pokemonList = useSelector(pokemonListSelector);
  const setPageItems = createAction<PokemonInfo[]>(SET_PAGE);
  const navigate = useNavigate();

  const [getPage, { loading }] = useLazyQuery(getPageQuery, {
    onCompleted: (data: { getPokemonList: PokemonInfo[] }) => {
      const pokemonList = data.getPokemonList;
      if (pokemonList.length === 0) {
        navigate("/not-found");
      } else {
        dispatch(setPageItems(pokemonList));
      }
    },
    onError: () => {
      navigate("/not-found");
    },
    //fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (isNaN(currentPage) || currentPage < 0) {
      navigate("/not-found");
    }
    getPage({ variables: { page: currentPage } });
  }, [currentPage, getPage, navigate]);

  return (
    <div>
      PokemonList
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          {pokemonList.map((item) => {
            return (
              <div key={item.id}>
                id: {item.id}
                name: {item.name}
                <img
                  alt={item.name}
                  src={item.image}
                  width={200}
                  height={200}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = notFound)
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PokemonList;
