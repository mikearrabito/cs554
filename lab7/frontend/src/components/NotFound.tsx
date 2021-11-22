import { Typography } from "@mui/material";

const NotFound = () => {
  return (
    <div>
      <Typography variant="h1" style={{ fontSize: "3.2rem" }}>
        Data not found
      </Typography>
      <Typography variant="h2" style={{ fontSize: "2rem" }}>
        Please go back and try again
      </Typography>
    </div>
  );
};

export default NotFound;
