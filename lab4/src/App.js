import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Details from "./pages/Details";
import ResultsListPage from "./pages/ResultsListPage";
import NotFound from "./pages/NotFound";
import StartPage from "./pages/StartPage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={StartPage} />
        <Route path="/:section/page/:page" exact component={ResultsListPage} />
        <Route path="/:section/:id" exact component={Details} />
        <Route path="/not-found" exact component={NotFound} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
