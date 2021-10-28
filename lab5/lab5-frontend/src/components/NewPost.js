import NavLinks from "./NavLinks";
import { useMutation } from "@apollo/client";
import { uploadImage } from "../gql/mutations";
import { useState } from "react";

const NewPost = () => {
  const [formData, setFormData] = useState({
    url: "",
    posterName: "",
    description: "",
  });
  const [success, setSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [errors, setErrors] = useState([]);

  const [upload] = useMutation(uploadImage, {
    onCompleted: () => {
      setSuccess(true);
      setUploadError(false);
    },
    onError: () => {
      setSuccess(false);
      setUploadError(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = [];
    setErrors([]);
    setUploadError(false);
    setSuccess(false);

    const form = { ...formData };

    if (formData.url.trim() === "") {
      form.url = "";
      errors.push("Enter an image URL");
    }
    if (formData.description.trim() === "") {
      form.description = "";
    }
    if (formData.posterName.trim() === "") {
      form.posterName = "";
      errors.push("Enter a name");
    }

    setFormData(form);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    upload({
      variables: {
        posterName: form.posterName,
        url: form.url,
        description: form.description === "" ? null : form.description,
      },
    });
  };

  return (
    <div>
      <NavLinks />
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label htmlFor="url">Image URL</label>
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />
        <label htmlFor="description">Description (optional)</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <label htmlFor="posterName">Your name</label>
        <input
          type="text"
          name="posterName"
          value={formData.posterName}
          onChange={(e) =>
            setFormData({ ...formData, posterName: e.target.value })
          }
        />
        <br />
        <button type="submit">Submit</button>
        {errors.length > 0 && (
          <div id="form-errors" style={{ color: "red" }}>
            <ul>
              Errors with your entry
              {errors.map((err) => {
                return <li key={err}>{err}</li>;
              })}
            </ul>
          </div>
        )}
      </form>
      {success && <p>Successfully uploaded image!</p>}
      {uploadError && (
        <p style={{ color: "red" }}>
          Error uploading image!
          <br />
          Try again.
        </p>
      )}
    </div>
  );
};
export default NewPost;
