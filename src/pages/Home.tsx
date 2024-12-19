import { useGlobalContext } from "../context/useGlobalContext";

const Home = () => {
  const { date } = useGlobalContext();

  return (
    <div>
      <h2>Home Page</h2>
      <p>Updated Time: {date}</p>
    </div>
  );
};

export default Home;
