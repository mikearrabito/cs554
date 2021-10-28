import NavLinks from "./NavLinks";
import ImageList from "./ImageList";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { unsplashImages } from "../gql/queries";

/*
Should display a list of image post results from Unsplash.
A user should be able to click a “Get More” button in order to perform another query to get more images from Unsplash.
A user should be able to click on a “Add to Bin” button found on a particular image post to “bin” a post.
Once a post has been added to the user’s bin, the “Add to bin” button should be toggled to “Remove from bin”
Each image post should contain a description, image, and the original poster/author
*/

const MainPage = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  const addImages = (images) => {
    setImages((i) => i.concat(images.unsplashImages));
  };

  const showError = () => {
    // handle error
  };

  const [getImages, { loading }] = useLazyQuery(unsplashImages, {
    onCompleted: addImages,
    onError: showError,
  });

  useEffect(() => {
    getImages({ variables: { pageNum: page } });
  }, [page, getImages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <NavLinks />
      {loading && "Loading images..."}
      <div>
        <ImageList images={images} allowBin />
        <button
          onClick={() => setPage(page + 1)}
          style={{ marginBottom: "20px" }}
        >
          Get More
        </button>
      </div>
    </div>
  );
};
export default MainPage;
