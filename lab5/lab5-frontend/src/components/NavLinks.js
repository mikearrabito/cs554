import { Link } from "react-router-dom";

const NavLinks = () => {
  return (
    <nav>
      <Link to="/" style={{ marginRight: "30px" }}>
        Main Page
      </Link>
      <Link to="/my-bin" style={{ marginRight: "30px" }}>
        My Bin
      </Link>
      <Link to="/my-posts">My Posts</Link>
    </nav>
  );
};

export default NavLinks;
