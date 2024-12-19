import { useGlobalContext } from "../context/useGlobalContext";

const Progress = () => {
  const { progressCount } = useGlobalContext();

  return (
    <div>
      <h2>Progress Page</h2>
      <p>Progress Count: {progressCount}</p>
    </div>
  );
};

export default Progress;
