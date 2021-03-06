import { useMutation } from "@apollo/client";
import {
  updateImage as updateImageMutation,
  deleteImage as deleteImageMutation,
} from "../gql/mutations";
import { useState } from "react";
import { useContext } from "react";
import { ImagesContext } from "../App";
import notFound from "../images/notFound.png";

const Image = (props) => {
  const { image, allowBin, allowDelete, removeOnUnbin } = props;

  const [images, setImages] = useContext(ImagesContext);

  const [binned, setBinned] = useState(image.binned);
  const [bins, setBins] = useState(image.numBinned);

  const [updateError, setUpdateError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(true);

  const [updateImage] = useMutation(updateImageMutation, {
    onCompleted: (image) => {
      setBinned(image.updateImage.binned);
      setBins(image.updateImage.numBinned);
      setImages(
        images
          .filter((i) => {
            if (removeOnUnbin) {
              // remove this item from imagecontext instead of just updating (for my bin and top my bin pages)
              return i.id !== image.updateImage.id;
            } else {
              return true;
            }
          })
          .map((img) => {
            return img.id === image.updateImage.id ? image.updateImage : img;
          })
      );
    },
    onError: () => {
      setUpdateError(true);
    },
  });

  const [deleteImage] = useMutation(deleteImageMutation, {
    onCompleted: (image) => {
      setImages(images.filter((img) => img.id !== image.deleteImage.id));
    },
    onError: () => {
      setDeleteError(true);
    },
  });

  return (
    <div>
      <img
        src={image.url}
        alt={image.description ?? `Post by ${image.posterName}`}
        style={{ marginBottom: "4px", maxWidth: "80%" }}
        onError={(e) => {
          if (imageLoadError) {
            setImageLoadError(false); // used to prevent infinite loop if theres an error loading our notFound image as well
            e.target.src = notFound;
          }
        }}
      />
      <p style={{ margin: "4px" }}>
        {image.description && (
          <>
            {image.description}
            <br />
          </>
        )}
        {`Posted by: ${image.posterName}`}
      </p>
      <p>Bins: {bins}</p>
      {allowBin && (
        <>
          <button
            onClick={() => {
              setDeleteError(false);
              setUpdateError(false);
              updateImage({
                variables: {
                  updateImageId: image.id,
                  binned: binned ? false : true,
                  url: image.url,
                  posterName: image.posterName,
                  description: image.description,
                  userPosted: image.userPosted,
                  numBinned: binned ? bins - 1 : bins + 1,
                },
              });
            }}
          >
            {binned === false ? "Add to Bin" : "Remove from bin"}
          </button>
          <br />
          <br />
        </>
      )}
      {allowDelete && (
        <button
          onClick={() => {
            setDeleteError(false);
            setUpdateError(false);
            deleteImage({ variables: { deleteImageId: image.id } });
          }}
        >
          Delete
        </button>
      )}
      {deleteError && <p style={{ color: "#ee0000" }}>Error deleting image!</p>}
      {updateError && <p style={{ color: "#ee0000" }}>Error updating image!</p>}
    </div>
  );
};

export default Image;
