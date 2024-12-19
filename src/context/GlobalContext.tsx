import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of our context
interface GlobalContextType {
  count: number;
  progressCount: number;
  date: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState<number>(0);
  const [progressCount, setProgressCount] = useState<number>(0);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const worker = new SharedWorker("/shared-worker.js");
    worker.port.start();

    worker.port.onmessage = (event) => {
      const [type, value] = event.data.split("|");

      if (type === "date") {
        setDate(value);
      } else if (type === "progress") {
        setProgressCount(parseInt(value));
      } else if (type === "count") {
        setCount(parseInt(value));
      }
    };

    return () => {
      worker.port.postMessage("disconnect");
      worker.port.close();
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ count, progressCount, date }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
