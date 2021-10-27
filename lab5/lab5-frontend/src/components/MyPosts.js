import ImageList from "./ImageList";
import NavLinks from "./NavLinks";
import { Link } from "react-router-dom";

/*
Should display a list of image posts that the user has posted.
This page should have similar functionality as the / page.
However, the user should be able to delete their posts from this page
Users can also only upload new posts from here as well.
*/
const images = ["image1", "image2", "image3", "image4", "image5"];

const MyPosts = () => {
  return (
    <div>
      <NavLinks />
      <Link to="/new-post">New Post</Link>
      <ImageList images={images} allowDelete />
    </div>
  );
};
export default MyPosts;
