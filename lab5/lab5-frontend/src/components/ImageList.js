const ImageList = (props) => {
  const { images, allowBin, allowDelete } = props;
  return (
    <ul>
      {images.map((img) => {
        return (
          <li key={img}>
            {img} {allowBin && <button>Add to Bin</button>}
            {allowDelete && <button>Delete</button>}
          </li>
        );
      })}
    </ul>
  );
};

export default ImageList;
