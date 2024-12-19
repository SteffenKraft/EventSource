import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const Header = () => {
  const { count } = useGlobalContext();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        background: "#f5f5f5",
      }}
    >
      <nav>
        <Link to="/" style={{ marginRight: "1rem" }}>
          Home
        </Link>
        <Link to="/progress">Progress</Link>
      </nav>
      <div>Count: {count}</div>
    </header>
  );
};

export default Header;
