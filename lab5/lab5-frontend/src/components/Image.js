import { useMutation } from "@apollo/client";
import {
  updateImage as updateImageMutation,
  deleteImage as deleteImageMutation,
} from "../gql/mutations";
import { useState } from "react";
import { useContext } from "react";
import { ImagesContext } from "../App";

const Image = (props) => {
  const { image, allowBin, allowDelete } = props;
  const [binned, setBinned] = useState(image.binned);
  const [images, setImages] = useContext(ImagesContext);
  const [updateError, setUpdateError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const [updateImage] = useMutation(updateImageMutation, {
    onCompleted: (image) => {
      setBinned(image.updateImage.binned);
      setImages(
        images.map((img) => {
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
      {allowBin && (
        <>
          <button
            onClick={() => {
              setUpdateError(false);
              updateImage({
                variables: {
                  updateImageId: image.id,
                  binned: binned ? false : true,
                  url: image.url,
                  posterName: image.posterName,
                  description: image.description,
                  userPosted: image.userPosted,
                },
              });
            }}
          >
            {binned === false ? "Add to Bin" : "Remove from bin"}
          </button>
          <br />
        </>
      )}
      {allowDelete && (
        <button
          onClick={() => {
            setDeleteError(false);
            deleteImage({ variables: { deleteImageId: image.id } });
          }}
        >
          Delete
        </button>
      )}
      {deleteError && <p style={{ color: "red" }}>Error deleting image!</p>}
      {updateError && <p style={{ color: "red" }}>Error updating image!</p>}
    </div>
  );
};

export default Image;
