import Image from "./Image";

const ImageList = (props) => {
  const { images, allowBin, allowDelete, removeOnUnbin } = props;

  return (
    <ul style={{ listStyleType: "none", padding: "0px" }}>
      {images.map((img) => {
        return (
          <li
            key={img.id}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              marginBottom: "18px",
            }}
          >
            <Image
              image={img}
              allowBin={allowBin}
              allowDelete={allowDelete}
              removeOnUnbin={removeOnUnbin}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ImageList;
