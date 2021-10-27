import NavLinks from "./NavLinks";
import ImageList from "./ImageList";

/*
Should display a list of image post results from Unsplash.
A user should be able to click a “Get More” button in order to perform another query to get more images from Unsplash.
A user should be able to click on a “Add to Bin” button found on a particular image post to “bin” a post.
Once a post has been added to the user’s bin, the “Add to bin” button should be toggled to “Remove from bin”
Each image post should contain a description, image, and the original poster/author
*/
const MainPage = () => {
  const getMore = (e) => {
    e.preventDefault();
  };

  const images = ["image1", "image2", "image3", "image4", "image5"];

  return (
    <div>
      <NavLinks />
      Starting page
      <ImageList images={images} allowBin />
      <button onClick={getMore}>Get More</button>
    </div>
  );
};
export default MainPage;
