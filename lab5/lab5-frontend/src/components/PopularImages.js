import NavLinks from "./NavLinks";
import { topBinned } from "../gql/queries";
import { useLazyQuery } from "@apollo/client";
import { ImagesContext } from "../App";
import { useContext, useEffect, useState } from "react";
import ImageList from "./ImageList";

let imagesLength = null;

const PopularImages = () => {
  const [images, setImages] = useContext(ImagesContext);
  const [total, setTotal] = useState(null);

  const [getImages, { loading, error }] = useLazyQuery(topBinned, {
    onCompleted: (data) => {
      setImages(data.getTopTenBinnedPosts);
      imagesLength = data.getTopTenBinnedPosts.length;
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getImages();
  }, [getImages]);

  useEffect(() => {
    setTotal((t) => 0);
    for (const img of images) {
      setTotal((t) => t + img.numBinned);
    }
    if (imagesLength !== images.length) {
      // image removed from list on client after being set to unbinned on server
      getImages(); // fetch new top 10 from server in the case of originally fetching 10 when user has > 10 binned images
      // bring list length back to 10 if more images are available
    }
  }, [images, getImages]);

  return (
    <div>
      <NavLinks />
      {loading ? (
        "Loading images..."
      ) : error ? (
        <p>Error loading images</p>
      ) : images.length ? (
        <>
          {total !== null && total > 200 ? (
            <h2>Category for your Bin is: Mainstream</h2>
          ) : (
            <h2>Category for your Bin is: Non-mainstream</h2>
          )}
          {total !== null && (
            <h3>Total count of Bins for your top ten binned images: {total}</h3>
          )}
          <ImageList images={images} allowBin removeOnUnbin />
        </>
      ) : (
        <p>No Binned images!</p>
      )}
    </div>
  );
};

export default PopularImages;
