import md5 from "md5";
import axios from "axios";

const publickey = process.env.REACT_APP_MARVEL_API_KEY;
const privatekey = process.env.REACT_APP_MARVEL_PRIVATE_API_KEY;
const baseUrl = "https://gateway.marvel.com/v1/public";

export const getMarvelData = async (section, num, isPage) => {
  // section == characters || comics || series
  // num is id for single or pageNum if isPage is set to true
  // isPage is bool, if false return single item with id num, else return page num
  if (
    section === null ||
    section === undefined ||
    num === null ||
    num === undefined
  ) {
    throw new Error("Missing parameters");
  }

  const ts = new Date().getTime();
  const hash = md5(ts + privatekey + publickey);
  let url = `${baseUrl}/${section}`;

  if (isPage === false) {
    url += `/${num}`;
    const response = await axios.get(url, {
      params: {
        apikey: publickey,
        ts,
        hash,
      },
    }); // handle 404 at the calling component
    return response.data.data;
  } else {
    // page based on second param passed
    const response = await axios.get(url, {
      params: {
        apikey: publickey,
        ts,
        hash,
        limit: 20, // default value, leaving it here for clarity
        offset: 20 * num, // 20 per page, multiply 20 by pagenum to get offset (20*0 = 0 for page 0, then offset of 20 for page 1, etc)
      },
    });
    return response.data.data;
  }
};

export const searchMarvelData = async (section, searchTerm, page) => {
  if (
    section !== "characters" &&
    section !== "series" &&
    section !== "comics"
  ) {
    throw new Error("Invalid search catergory");
  }
  if (typeof searchTerm !== "string" || searchTerm.trim() === "") {
    throw new Error(
      "Invalid search term, must be string and must not only be whitespace"
    );
  }
  const ts = new Date().getTime();
  const hash = md5(ts + privatekey + publickey);

  const searchParam =
    section === "characters" ? "nameStartsWith" : "titleStartsWith";
  const url = `${baseUrl}/${section}`;

  const response = await axios.get(url, {
    params: {
      apikey: publickey,
      ts,
      hash,
      [searchParam]: searchTerm,
      limit: 20,
      offset: 20 * page,
    },
  });
  return response.data.data;
};
