import ImageList from "./ImageList";
import NavLinks from "./NavLinks";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { userPostedImages } from "../gql/queries";
import { useQuery } from "@apollo/client";
import { ImagesContext } from "../App";

const MyPosts = () => {
  const [images, setImages] = useContext(ImagesContext);

  const { loading, error } = useQuery(userPostedImages, {
    onCompleted: (data) => {
      setImages(data.userPostedImages);
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
