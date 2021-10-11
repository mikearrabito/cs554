import { Typography } from "@mui/material";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h1">404: Not Found</Typography>
      <Typography variant="h2">
        The data you requested could not be found, Go back and try again
      </Typography>
    </div>
  );
};

export default NotFound;
