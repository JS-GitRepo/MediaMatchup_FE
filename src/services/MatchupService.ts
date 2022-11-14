import axios from "axios";
import Matchup from "../models/Matchup";

const baseURL: string = `${import.meta.env.VITE_API_URL}/matchups` || "";

export const getMatchupsByUID = async (uid: string): Promise<Matchup[]> => {
  return (await axios.get(baseURL, { params: { uid: uid } })).data;
};

export const submitMatchup = async (matchup: Matchup): Promise<Matchup> => {
  return (await axios.post(baseURL, matchup)).data;
};
