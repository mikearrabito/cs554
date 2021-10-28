import NavLinks from "./NavLinks";
import ImageList from "./ImageList";
import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { binnedImages } from "../gql/queries";
import { ImagesContext } from "../App";

const MyBin = () => {
  const [images, setImages] = useContext(ImagesContext);

  const { loading, error } = useQuery(binnedImages, {
    onCompleted: (data) => {
      setImages(data.binnedImages);
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
      ) : images.length ? (
        <ImageList images={images} allowBin removeOnUnbin />
      ) : (
        <p>No Binned images!</p>
      )}
    </div>
  );
};
export default MyBin;
