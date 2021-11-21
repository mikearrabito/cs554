import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
// import { createAction } from '@reduxjs/toolkit'

// const increment = createAction<number | undefined>(ACTION_HERE)
// let action = increment()
// const dispatch = useDispatch()
// dispatch(action)

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/pokemon/page/:page" />
          <Route path="/pokemon/:id" />
          <Route path="/trainers" />
          <Route path="*" element={NotFound()} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
