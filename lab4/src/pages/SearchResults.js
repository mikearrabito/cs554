import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../App";
import { searchMarvelData } from "../api";
import { useHistory } from "react-router";
import {
  LinearProgress,
  Pagination,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import InfoCard from "../components/InfoCard";

const SearchResults = () => {
  const { searchValues } = useContext(SearchContext);
  const { searchTerm, section, fromPage } = searchValues;

  const [loading, setLoading] = useState(true);
  const [marvelData, setMarvelData] = useState(null);
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const [noneFound, setNoneFound] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const search = async () => {
      try {
        setLoading(true);
        setNoneFound(false);
        const data = await searchMarvelData(section, searchTerm, pageNum);

        const total = parseInt(data.total);
        const perPage = parseInt(data.limit);
        setTotalPages(Math.ceil(total / perPage));

        if (!data || !data.results?.length) {
          throw new Error("No data found for this page");
        }

        setMarvelData(data.results);
      } catch (e) {
        setNoneFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (
      section === "characters" ||
      section === "comics" ||
      (section === "series" &&
        typeof searchTerm === "string" &&
        searchTerm.trim() !== "")
    ) {
      search();
    } else {
      history.replace("/not-found");
    }
  }, [pageNum, history, searchTerm, section]);

  return (
    <div>
      {loading ? (
        <>
          <LinearProgress />
        </>
      ) : noneFound ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h1" style={{ fontSize: "2rem" }}>
            No search results found for {section} starting with "{searchTerm}"
          </Typography>
          <div style={{ height: "10px" }} />
          <Button
            component={Link}
            to={`/${section}/page/${fromPage}`}
            variant="outlined"
            style={{ width: "25%" }}
          >
            Back to {section}
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h1" style={{ fontSize: "2rem" }}>
            Search results for {section} starting with "{searchTerm}"
          </Typography>
          <Button
            component={Link}
            to={`/${section}/page/${fromPage}`}
            variant="outlined"
            style={{ width: "25%" }}
          >
            Back to {section}
          </Button>
          {totalPages !== null && (
            <Pagination
              hidePrevButton={pageNum === 0}
              hideNextButton={pageNum === totalPages - 1}
              count={totalPages}
              page={pageNum + 1}
              variant="outlined"
              color="standard"
              size="large"
              getItemAriaLabel={(type, page, selected) => {
                return page ? `${type}-${page}-${selected}` : undefined;
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px",
              }}
              onChange={(e, v) => {
                setPageNum(v - 1);
              }}
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
                    <InfoCard info={item} section={section} />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
