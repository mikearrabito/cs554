import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <Link to="/" style={{ marginRight: "20px" }}>
        Home
      </Link>
      <Link to="/pokemon/page/0" style={{ marginRight: "20px" }}>
        Pokemon
      </Link>
      <Link to="/trainers">Trainers</Link>
    </nav>
  );
};

export default Nav;
