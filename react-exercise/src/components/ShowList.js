import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import SearchShows from "./SearchShows";
import noImage from "../img/download.jpeg";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";

import "../App.css";
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
  pageInfo: {
    marginTop: "6px",
    fontWeight: 600,
  },
  navButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "6px",
    marginBottom: "10px",
  },
});

const ShowList = (props) => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const history = useHistory();

  const { pageNum } = props.match.params;

  let card = null;

  useEffect(() => {
    const fetchData = async (pageNum) => {
      try {
        const { data } = await axios.get(
          `http://api.tvmaze.com/shows?page=${pageNum - 1}`
        ); // decrement since api uses 0 based page num
        setShowsData(data);
        setLoading(false);
      } catch (e) {
        history.replace("/shows/page/233"); // given page is too high, just redirect to last known good page
      }
    };
    if (isNaN(parseInt(pageNum)) || parseInt(pageNum) < 1) {
      // redirect to page 1 if not given int for page or given int is 0 or negative
      history.replace("/shows/page/1");
    } else {
      fetchData(pageNum); // fetch this page of shows if given a number that is greater than 0
    }
  }, [pageNum, history]);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          "http://api.tvmaze.com/search/shows?q=" + searchTerm
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchData();
    }
  }, [searchTerm]);

  useEffect(() => {}, [pageNum]);

  useEffect(() => {}, [props.match.params.pageNum]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title="show image"
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {show.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {show.summary
                    ? show.summary.replace(regex, "").substring(0, 139) + "..."
                    : "No Summary"}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        let { show } = shows;
        return buildCard(show);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }

  const prevPage = () => {
    if (parseInt(pageNum) <= 1) {
      return;
    }
    setLoading(true);
    history.push(`/shows/page/${parseInt(pageNum) - 1}`);
  };
  const nextPage = () => {
    // check if next page has 404
    if (parseInt(pageNum) >= 233) {
      return;
    }
    setLoading(true);
    history.push(`/shows/page/${parseInt(pageNum) + 1}`);
  };

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <SearchShows searchValue={searchValue} />

        <div className={classes.pageInfo}>Page: {pageNum}</div>

        <div>
          <div className={classes.navButtons}>
            {parseInt(pageNum) !== 1 && (
              <>
                <Button
                  onClick={prevPage}
                  variant="contained"
                  style={{ marginLeft: "4px" }}
                >
                  prev
                </Button>
                {parseInt(pageNum) < 233 && <div style={{ width: "5%" }} />}
              </>
            )}
            {parseInt(pageNum) < 233 && (
              <Button onClick={nextPage} variant="contained">
                next
              </Button>
            )}
          </div>
        </div>

        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default ShowList;
