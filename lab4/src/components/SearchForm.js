import { TextField } from "@mui/material";
import { useState } from "react";

const SearchForm = (props) => {
  const { updateFn } = props;

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchInput = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value); // update value in textfield
    updateFn(e.target.value); // propagate value back to parent
  };

  return (
    <TextField
      id="search-form"
      label="Search"
      variant="outlined"
      style={{ margin: "8px" }}
      value={searchTerm}
      onChange={handleSearchInput}
    />
  );
};

export default SearchForm;
