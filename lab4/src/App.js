import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CharacterDetails from "./pages/CharacterDetails";
import CharactersPage from "./pages/CharactersPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          main page
        </Route>
        <Route path="/characters/page/:page" exact component={CharactersPage} />
        <Route path="/characters/:id" exact component={CharacterDetails} />
        <Route path="/comics/page/:page" exact />
        <Route path="/comics/:id" exact />
        <Route path="/series/page/:page" exact />
        <Route path="/series/:id" exact />
        <Route path="/not-found" exact component={NotFound} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}
