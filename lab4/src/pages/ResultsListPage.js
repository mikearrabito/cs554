import { getMarvelData } from "../api";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationItem,
  Typography,
  LinearProgress,
  Grid,
  Button,
} from "@mui/material";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import SearchForm from "../components/SearchForm";

const ResultsListPage = (props) => {
  const { match } = props;
  const pageNum = parseInt(match?.params?.page);
  const { section } = match?.params; // characters or comics or series

  const [marvelData, setMarvelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const history = useHistory();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setSearchTerm("");
        setTotalPages(null);
        setLoading(true);

        const data = await getMarvelData(section, pageNum, true);

        const total = parseInt(data.total);
        const perPage = parseInt(data.limit);
        setTotalPages(Math.ceil(total / perPage)); // ceiling of total/perPage, since last page can have <= perPage results

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
    if (
      !isNaN(pageNum) &&
      pageNum >= 0 &&
      (section === "characters" || section === "comics" || section === "series")
    ) {
      fetchPage();
    } else {
      history.replace("/not-found"); // invalid pageNum given, or invalid section
    }
  }, [pageNum, section, history]);

  useEffect(() => {
    // fix for memory leak error in console when redirecting to 404 page
    return () => {
      setLoading(null);
      setMarvelData(null);
      setTotalPages(null);
      setSearchTerm(null);
    };
  }, []);

  return (
    <div>
      {loading ? (
        <>
          <LinearProgress />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h1"
            align="center"
            style={{ fontSize: "3.4rem" }}
          >
            Marvel{" "}
            {section?.length && section[0].toUpperCase() + section.slice(1)}
          </Typography>
          <div
            style={{
              display: "flex",
            }}
          >
            <Button
              component={Link}
              to="/"
              variant="outlined"
              style={{ marginRight: "10px" }}
            >
              Main Page
            </Button>
            {section !== "characters" && (
              <Button
                component={Link}
                to="/characters/page/0"
                variant="outlined"
                style={{ marginRight: "10px" }}
              >
                Characters
              </Button>
            )}
            {section !== "comics" && (
              <Button
                component={Link}
                to="/comics/page/0"
                variant="outlined"
                style={{ marginRight: "10px" }}
              >
                Comics
              </Button>
            )}
            {section !== "series" && (
              <Button component={Link} to="/series/page/0" variant="outlined">
                Series
              </Button>
            )}
          </div>
          {totalPages !== null && (
            <Pagination
              hidePrevButton={pageNum === 0}
              count={totalPages}
              page={pageNum + 1}
              variant="outlined"
              color="standard"
              size="large"
              getItemAriaLabel={(type, page, selected) => {
                return page ? `${type}-${page}-${selected}` : null;
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px",
              }}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={item.page >= 1 && `/${section}/page/${item.page - 1}`}
                  {...item}
                />
              )}
            />
          )}
          <SearchForm
            callback={(input) => {
              setSearchTerm(input.toLowerCase());
            }}
          />
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
              {marvelData
                .filter((item) => {
                  return item.name
                    ? item.name.toLowerCase().includes(searchTerm)
                    : item.title.toLowerCase().includes(searchTerm);
                })
                .map((item) => {
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

export default ResultsListPage;
