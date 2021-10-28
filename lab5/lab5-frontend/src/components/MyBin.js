import NavLinks from "./NavLinks";
import ImageList from "./ImageList";
import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { binnedImages } from "../gql/queries";
import { ImagesContext } from "../App";

/*
Should display a list of image posts that the user has previously added to their bin.
This page should have similar functionality as the / page.
*/
const MyBin = () => {
  const [images, setImages] = useContext(ImagesContext);

  const { loading, error } = useQuery(binnedImages, {
    onCompleted: (data) => {
      setImages(data.binnedImages);
    },
    onError: (e) => {
      // display error fetching images
    },
    fetchPolicy: "network-only",
  });

  return (
    <div>
      <NavLinks />
      {loading ? (
        "Loading images..."
      ) : error ? (
        <p>Error loading images</p>
      ) : images.filter((img) => img.binned).length ? (
        <ImageList images={images.filter((img) => img.binned)} allowBin />
      ) : (
        <p>No Binned images!</p>
      )}
    </div>
  );
};
export default MyBin;
