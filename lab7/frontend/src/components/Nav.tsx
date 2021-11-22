import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav style={{ margin: 10 }}>
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
