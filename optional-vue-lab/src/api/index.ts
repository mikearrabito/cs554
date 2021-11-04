import md5 from "md5";
import axios from "axios";
import { MarvelApiResponse } from "../types/types";

const publickey = process.env.VUE_APP_MARVEL_API_KEY;
const privatekey = process.env.VUE_APP_MARVEL_PRIVATE_API_KEY || "";
const baseUrl = "https://gateway.marvel.com/v1/public";

export const getMarvelData = async (
  section: "characters" | "comics" | "series",
  num: number,
  isPage: boolean
): Promise<MarvelApiResponse> => {
  // num is id for single or pageNum if isPage is set to true
  // isPage: if false return single item with id num, else return page num

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
    return { ...response.data.data, page: null };
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
    return { ...response.data.data, page: num + 1 };
  }
};

export const searchMarvelData = async (
  section: "characters" | "comics" | "series",
  searchTerm: string,
  page: number
): Promise<MarvelApiResponse> => {
  if (searchTerm.trim() === "") {
    throw new Error("Search term must not only be whitespace");
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
  return { ...response.data.data, page: null };
};
