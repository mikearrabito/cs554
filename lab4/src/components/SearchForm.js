import { TextField, Button } from "@mui/material";
import { useState } from "react";

const SearchForm = (props) => {
  const { callback } = props;

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchInput = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setSearchTerm("");
    } else {
      callback(searchTerm.trim().toLowerCase());
    }
  };

  return (
    <form
      style={{ display: "flex", alignItems: "center" }}
      onSubmit={handleSubmit}
    >
      <TextField
        id="search-form"
        label="Search"
        variant="outlined"
        size="small"
        style={{ margin: "8px" }}
        value={searchTerm}
        onChange={handleSearchInput}
      />
      <Button variant="outlined" type="submit">
        Search
      </Button>
    </form>
  );
};

export default SearchForm;
