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
  let url = `${baseUrl}/${section}`; // url/characters or comics or series

  if (isPage === false) {
    url += `/${num}`;
    const response = await axios.get(url, {
      params: {
        apikey: publickey,
        ts,
        hash,
      },
    });
    return response.data.data;
    // handle 404 at the calling component
  } else {
    // page based on second param passed
    const pageNum = num;

    const response = await axios.get(url, {
      params: {
        apikey: publickey,
        ts,
        hash,
        offset: 20 * pageNum, // 20 per page, multiple 20 by pagenum to get offset (20*0 = 0 for page 0, then offset of 20 for page 1, etc)
      },
    });

    return response.data.data;
  }
};
