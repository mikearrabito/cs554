import ImageList from "./ImageList";
import NavLinks from "./NavLinks";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { userPostedImages } from "../gql/queries";
import { useQuery } from "@apollo/client";
import { ImagesContext } from "../App";

/*
Should display a list of image posts that the user has posted.
This page should have similar functionality as the / page.
However, the user should be able to delete their posts from this page
Users can also only upload new posts from here as well.
*/
const MyPosts = () => {
  const [images, setImages] = useContext(ImagesContext);

  const { loading, error } = useQuery(userPostedImages, {
    onCompleted: (data) => {
      setImages(data.userPostedImages);
    },
    onError: (e) => {
      // display error fetching images
    },
    fetchPolicy: "network-only",
  });

  return (
    <div>
      <NavLinks />
      <div style={{ margin: "20px" }} />
      <Link to="/new-post">New Post</Link>
      {loading ? (
        "Loading images..."
      ) : error ? (
        <p>Error loading images</p>
      ) : images.length === 0 ? (
        <p>No images posted yet!</p>
      ) : (
        <ImageList images={images} allowDelete allowBin />
      )}
    </div>
  );
};
export default MyPosts;
