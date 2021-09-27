const { SHOWS_ENDPOINT, SHOWS_SEARCH_ENDPOINT } = require("../constants");
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = (app) => {
  app.get("/", async (req, res) => {
    if (await client.existsAsync("homepage-html")) {
      return res.send(await client.getAsync("homepage-html"));
    } else {
      let shows;
      try {
        shows = await axios.get(SHOWS_ENDPOINT);
        shows = shows.data;
      } catch (e) {
        return res
          .status(500)
          .send(`error getting shows at ${SHOWS_ENDPOINT}: ${e}`);
      }

      return res.render(
        "homepage",
        { pageTitle: "List of Shows", shows },
        (err, html) => {
          client.setAsync("homepage-html", html);
          return res.send(html);
        }
      );
    }
  });

  app.get("/show/:id", async (req, res) => {
    const { id } = req.params;

    if (await client.existsAsync(`show-${id}`)) {
      const cachedShowPageHtml = await client.getAsync(`show-${id}`);
      return res.send(cachedShowPageHtml);
    } else {
      let show;
      try {
        show = await axios.get(`${SHOWS_ENDPOINT}/${id}`);
        show = show.data;
      } catch (e) {
        return res.status(404).render("show/show-info", {
          pageTitle: "Show not found",
          showInfoError: "Show not found",
        });
      }

      return res.render(
        "show/show-info",
        { pageTitle: show.name, show },
        (err, html) => {
          client.setAsync(`show-${id}`, html);
          return res.send(html);
        }
      );
    }
  });

  app.post("/search", async (req, res) => {
    let { searchTerm } = req.body;

    if (searchTerm == null || searchTerm == "") {
      return res.status(400).render("search", {
        pageTitle: "Search Error",
        searchError: "No search term provided",
      });
    }
    if (typeof searchTerm !== "string") {
      return res.status(400).render("search", {
        pageTitle: "Search Error",
        searchError: "Search term must be a string",
      });
    }

    searchTerm = searchTerm.trim();

    if (searchTerm === "") {
      return res.status(400).render("search", {
        pageTitle: "Search Error",
        searchError: "Search term must not be whitespace only",
      });
    }

    if (await client.zscoreAsync("top-searches", searchTerm.toLowerCase())) {
      client.zincrbyAsync("top-searches", 1, searchTerm.toLowerCase());
    } else {
      client.zaddAsync("top-searches", 1, searchTerm.toLowerCase());
    }

    if (
      await client.existsAsync(`search-results-for-${searchTerm.toLowerCase()}`)
    ) {
      return res.send(
        await client.getAsync(`search-results-for-${searchTerm.toLowerCase()}`)
      );
    }

    let searchResult;
    try {
      searchResult = await axios.get(
        `${SHOWS_SEARCH_ENDPOINT}?q=${searchTerm}`
      );
      searchResult = searchResult.data;

      if (searchResult.length === 0) {
        return res.status(404).render("search", {
          pageTitle: "Search Results",
          searchError: "No Shows Found",
        });
      }

      return res.render(
        "search",
        { pageTitle: "Search Results", searchResult },
        async (err, html) => {
          client.setAsync(
            `search-results-for-${searchTerm.toLowerCase()}`,
            html
          );
          return res.send(html);
        }
      );
    } catch (e) {
      return res.status(500).render("search", {
        pageTitle: "Search Results",
        searchError: "Error with search",
      });
    }
  });

  app.get("/popularsearches", async (req, res) => {
    // display top 10 searches from sorted set "top-searches"
    // highest to lowest descending
    const topTenSearches = await client.zrevrangeAsync("top-searches", 0, 9);
    res.render("top-searches", { pageTitle: "Top Searches", topTenSearches });
  });
};
