import { useState } from "react";
import { Matchup } from "../models/Matchup";

export const useInfiniteScroll = (array: Matchup[]) => {
  const arrayLength = array.length;
  const [items, setItems] = useState([]);

  return { items };
};
