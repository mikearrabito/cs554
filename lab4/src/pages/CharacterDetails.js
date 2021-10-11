import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getMarvelData } from "../api";
import CharacterCard from "../components/CharacterCard";

const CharacterDetails = (props) => {
  const id = parseInt(props?.match?.params?.id);
  const [charData, setCharData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMarvelData("characters", id, false);
        if (data.results.length) {
          setCharData(data.results);
        } else {
          throw new Error("No results found");
        }
      } catch (e) {
        history.replace("/not-found"); // no results found for this given id
      }
    };
    if (id !== null && id !== undefined && !isNaN(id) && id > 0) {
      fetchData();
    } else {
      history.replace("/not-found"); // invalid id given
    }
  }, [history, id]);

  useEffect(() => {
    return () => {
      setCharData(null);
    };
  }, []);

  return (
    <>
      {charData !== null && <CharacterCard charInfo={charData[0]} detailed />}
    </>
  );
};

export default CharacterDetails;
