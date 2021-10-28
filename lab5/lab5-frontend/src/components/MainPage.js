import NavLinks from "./NavLinks";
import ImageList from "./ImageList";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { unsplashImages } from "../gql/queries";

const MainPage = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  const [getImages, { loading }] = useLazyQuery(unsplashImages, {
    onCompleted: (images) => {
      setImages((i) => i.concat(images.unsplashImages));
    },
    onError: () => {
      alert("Error fetching page of images, try again");
    },
    fetchPolicy: "network-only",
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
          onClick={() => {
            if (!loading) {
              setPage(page + 1);
            }
          }}
          style={{ marginBottom: "20px" }}
        >
          Get More
        </button>
      </div>
    </div>
  );
};
export default MainPage;
