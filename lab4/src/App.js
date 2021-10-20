import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Details from "./pages/Details";
import ResultsListPage from "./pages/ResultsListPage";
import NotFound from "./pages/NotFound";
import StartPage from "./pages/StartPage";
import SearchResults from "./pages/SearchResults";
import { createContext, useState } from "react";

export const SearchContext = createContext();

const App = () => {
  const [searchValues, setSearchValues] = useState({});

  return (
    <SearchContext.Provider value={{ searchValues, setSearchValues }}>
      <Router>
        <Switch>
          <Route path="/" exact component={StartPage} />
          <Route path="/search" exact component={SearchResults} />
          <Route
            path="/:section/page/:page"
            exact
            component={ResultsListPage}
          />
          <Route path="/:section/:id" exact component={Details} />
          <Route path="/not-found" exact component={NotFound} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </SearchContext.Provider>
  );
};

export default App;
