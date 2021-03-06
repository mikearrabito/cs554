import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createContext, useState } from "react";
import MainPage from "./components/MainPage";
import MyBin from "./components/MyBin";
import MyPosts from "./components/MyPosts";
import NewPost from "./components/NewPost";
import PopularImages from "./components/PopularImages";

export const ImagesContext = createContext();

const App = () => {
  const [images, setImages] = useState([]);

  return (
    <ImagesContext.Provider value={[images, setImages]}>
      <h1 className="page-header">Binterest</h1>
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact component={MainPage} />
            <Route path="/my-bin" exact component={MyBin} />
            <Route path="/my-posts" exact component={MyPosts} />
            <Route path="/new-post" exact component={NewPost} />
            <Route path="/popularity" exact component={PopularImages} />
          </Switch>
        </Router>
      </div>
    </ImagesContext.Provider>
  );
};

export default App;
