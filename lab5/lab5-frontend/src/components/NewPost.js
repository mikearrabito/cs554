import NavLinks from "./NavLinks";

/*
Should render a form that has fields for:
Image URL (we only allow image urls that are already on the internet)
Description
Poster name (this should in theory be the same all the time, but user identification is out of the scope of this lab)
*/
const NewPost = () => {
  return (
    <div>
      <NavLinks />
      NewPost page
    </div>
  );
};
export default NewPost;
