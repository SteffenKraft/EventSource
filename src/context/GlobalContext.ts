import { createContext } from "react";

// Define the shape of our context
interface GlobalContextType {
  count: number;
  progressCount: number;
  date: string;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);
