import { Link } from "react-router-dom";

const NavLinks = () => {
  return (
    <nav>
      <Link to="/">Main Page</Link>
      <Link to="/my-bin">My Bin</Link>
      <Link to="/my-posts">My Posts</Link>
    </nav>
  );
};

export default NavLinks;
