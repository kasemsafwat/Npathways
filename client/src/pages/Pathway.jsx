import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
function Pathway() {
  const [pathway, setPathway] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPathway = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5024/api/pathway/getPathway/${id}`,
          { withCredentials: true }
        );
        setPathway(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching pathway:", error);
      }
    };

    fetchPathway();
  }, [id]); // Add id as dependency to re-fetch when id changes

  return <div>{pathway ? `Pathway: ${pathway.name}` : "Loading..."}</div>;
}

export default Pathway;
