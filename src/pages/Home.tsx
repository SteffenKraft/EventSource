import { useGlobalContext } from "../context/GlobalContext";

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