import { createAction } from "@reduxjs/toolkit";
import { SET_PAGE } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import { pokemonListSelector } from "../redux/selectors";
import { PokemonInfo } from "../types/Pokemon";
import { useLazyQuery } from "@apollo/client";
import { getPageQuery } from "../gql/queries";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pagination, Typography, LinearProgress } from "@mui/material";
import notFound from "../images/notFound.png";

const PokemonList = (props: object) => {
  const params = useParams();
  let page: number = -1;

  if (params.page !== undefined) {
    page = parseInt(params.page);
  }

  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);

  const dispatch = useDispatch();
  const pokemonList = useSelector(pokemonListSelector);
  const setPageItems = createAction<PokemonInfo[]>(SET_PAGE);
  const navigate = useNavigate();

  const [getPage, { loading }] = useLazyQuery(getPageQuery, {
    onCompleted: (data: {
      getPokemonList: {
        pokemonList: PokemonInfo[];
        totalCount: number;
        perPage: number;
      };
    }) => {
      const perPage = data.getPokemonList.perPage;
      const totalCount = data.getPokemonList.totalCount;
      setTotalPages(Math.ceil(totalCount / perPage));

      const pokemonList = data.getPokemonList.pokemonList;
      if (pokemonList.length === 0) {
        navigate("/not-found");
      } else {
        dispatch(setPageItems(pokemonList));
      }
    },
    onError: () => {
      navigate("/not-found");
    },
  });

  useEffect(() => {
    if (isNaN(currentPage) || currentPage < 0) {
      navigate("/not-found");
    }
    getPage({ variables: { page: currentPage } });
  }, [currentPage, getPage, navigate]);

  return (
    <div>
      {loading ? (
        <div>
          <LinearProgress />
        </div>
      ) : (
        <div>
          {totalPages !== 0 && (
            <Pagination
              hidePrevButton={currentPage === 0}
              hideNextButton={currentPage === totalPages - 1}
              count={totalPages}
              page={currentPage + 1}
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px",
              }}
              size="large"
              onChange={(e, newPage) => {
                setCurrentPage(newPage - 1);
                navigate(`/pokemon/page/${newPage - 1}`);
              }}
            />
          )}
          <div>
            {pokemonList.map((item) => {
              return (
                <div key={item.id}>
                  <img
                    alt={item.name}
                    src={item.image}
                    width={200}
                    height={200}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = notFound)
                    }
                  />
                  <Typography>{item.name}</Typography>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonList;
