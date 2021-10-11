import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getMarvelData } from "../api";
import InfoCard from "../components/InfoCard";

const Details = (props) => {
  const id = parseInt(props?.match?.params?.id);
  const { section } = props?.match?.params;

  const [charData, setCharData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMarvelData(section, id, false);
        if (data.results.length) {
          setCharData(data.results);
        } else {
          throw new Error("No results found");
        }
      } catch (e) {
        history.replace("/not-found"); // no results found for this given id
      }
    };
    if (
      !isNaN(id) &&
      id >= 0 &&
      (section === "characters" || section === "comics" || section === "series")
    ) {
      fetchData();
    } else {
      history.replace("/not-found"); // invalid id given or invalid section
    }
  }, [history, section, id]);

  useEffect(() => {
    return () => {
      setCharData(null);
    };
  }, []);

  return (
    <>
      {charData !== null && (
        <InfoCard info={charData[0]} detailed section={section} />
      )}
    </>
  );
};

export default Details;
