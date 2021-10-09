import { getMarvelData } from "../api";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationItem,
  Typography,
  LinearProgress,
  Grid,
} from "@mui/material";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";

export default function CharactersPage(props) {
  const [marvelData, setMarvelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(null);
  const { match } = props;
  const pageNum = parseInt(match?.params?.page);
  const history = useHistory();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const data = await getMarvelData("characters", pageNum, true);

        if (totalPages === null) {
          const total = parseInt(data.total);
          const perPage = parseInt(data.limit);
          setTotalPages(parseInt(total / perPage) + 1);
        }

        if (data.results.length === 0) {
          throw new Error("No data found for this page");
        }

        setMarvelData(data.results);
      } catch (e) {
        // 404 or 500 or empty array returned from api
        // redirect to NotFound/404 page
        history.replace("/not-found");
      } finally {
        setLoading(false);
      }
    };
    if (!isNaN(pageNum) || pageNum >= 0) {
      fetchPage();
    } else {
      history.replace("/not-found"); // invalid page given in url
    }
  }, [pageNum, totalPages, history]);

  useEffect(() => {
    // fix for memory leak error in console when redirecting to 404 page
    return () => {
      setLoading(null);
      setMarvelData(null);
      setTotalPages(null);
    };
  }, []);

  return (
    <div>
      {loading ? (
        <>
          <LinearProgress />
        </>
      ) : (
        <div>
          <Typography variant="h1" align="center" style={{ fontSize: "3rem" }}>
            Marvel Characters
          </Typography>
          {totalPages !== null && (
            <Pagination
              hidePrevButton={pageNum === 0}
              hideNextButton={pageNum === totalPages - 1}
              color="primary"
              count={totalPages}
              page={pageNum + 1}
              variant="outlined"
              size="large"
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px",
              }}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/characters/page/${item.page - 1}`}
                  {...item}
                />
              )}
            />
          )}
          {marvelData !== null && (
            <Grid
              container
              rowSpacing={4}
              columnSpacing={4}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: "1",
              }}
            >
              {marvelData.map((item) => {
                return (
                  <Grid item key={item.id}>
                    <CharacterCard charInfo={item} />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </div>
      )}
    </div>
  );
}
