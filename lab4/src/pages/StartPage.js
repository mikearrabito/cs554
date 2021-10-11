import { Link } from "react-router-dom";

const StartPage = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <Link to="/characters/page/0">Characters</Link>
        <Link to="/comics/page/0">Comics</Link>
        <Link to="/series/page/0">Series</Link>
      </div>
    </div>
  );
};

export default StartPage;
