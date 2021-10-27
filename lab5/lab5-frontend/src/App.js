import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import MyBin from "./components/MyBin";
import MyPosts from "./components/MyPosts";
import NewPost from "./components/NewPost";

function App() {
  return (
    <>
      <h1 className="page-header">Binterest</h1>
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact component={MainPage} />
            <Route path="/my-bin" exact component={MyBin} />
            <Route path="/my-posts" exact component={MyPosts} />
            <Route path="/new-post" exact component={NewPost} />
          </Switch>
        </Router>
      </div>
    </>
  );
}

export default App;
