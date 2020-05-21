import React, { useState, useEffect } from "react";

import { Title, Repositories } from "./styles";
import api from "./services/api";

interface Places {
  id: number;
  name: string;
  image_url: string;
  votes: number;
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Places[]>(() => {
    const storagedRepositories = localStorage.getItem("@PlayerUm:places");

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  const [reload, setReload] = useState(false);

  async function execute() {
    const response = await api.get<Places[]>(`votes`);

    const places = response.data;

    setRepositories(places);
    console.log("hey");
  }
  useEffect(() => {
    execute();
  }, [reload]);
  localStorage.setItem("@PlayerUm:places", JSON.stringify(repositories));

  const handleAddVote = async (id: number) => {
    console.log("hey -> " + id);

    await api.post(`votes/${id}`);
    setReload(!reload);
  };
  return (
    <>
      <Title>Explore Places</Title>

      <Repositories>
        {repositories.map((place) => (
          <div key={place.id}>
            <img
              src={"http://localhost:3333/files/" + place.image_url}
              alt={place.name}
            />
            <div>
              <strong>{place.name}</strong>
              <p>{place.votes}</p>
            </div>
            <button onClick={() => handleAddVote(place.id)}>Vote</button>
            {/* <FiChevronRight size={20} /> */}
          </div>
        ))}
      </Repositories>
    </>
  );
};
export default Dashboard;
