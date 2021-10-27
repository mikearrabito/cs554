import NavLinks from "./NavLinks";
import ImageList from "./ImageList";

/*
Should display a list of image posts that the user has previously added to their bin.
This page should have similar functionality as the / page.
*/
const MyBin = () => {
  const images = ["image1", "image2", "image3", "image4", "image5"];

  return (
    <div>
      <NavLinks />
      MyBin
      <ImageList images={images} />
    </div>
  );
};
export default MyBin;
