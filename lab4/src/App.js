import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CharacterDetails from "./pages/CharacterDetails";
import ResultsListPage from "./pages/ResultsListPage";
import NotFound from "./pages/NotFound";
import StartPage from "./pages/StartPage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={StartPage} />
        <Route path="/:section/page/:page" exact component={ResultsListPage} />
        <Route path="/characters/:id" exact component={CharacterDetails} />
        <Route path="/comics/:id" exact />
        <Route path="/series/:id" exact />
        <Route path="/not-found" exact component={NotFound} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
