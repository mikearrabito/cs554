import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import Trainers from "./components/Trainers";
import PokemonDetails from "./components/PokemonDetails";
import PokemonList from "./components/PokemonList";
import MainPage from "./components/MainPage";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/pokemon/page/:page" element={<PokemonList />} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
