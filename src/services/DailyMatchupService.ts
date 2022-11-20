import axios from "axios";
import DailyMatchupCollection from "../models/DailyMatchupCollection";

const baseURL: string = `${import.meta.env.VITE_API_URL}/dailymatchups` || "";

export const getDailyMatchupCollection = async (
  simpleDate: number
): Promise<DailyMatchupCollection> => {
  const data = (await axios.get(baseURL, { params: { date: simpleDate } }))
    .data;
  console.log(data);

  return data;
};

export const postDailyMatchupCollection = async (
  dailyCollection: DailyMatchupCollection
): Promise<DailyMatchupCollection> => {
  return (await axios.post(baseURL, dailyCollection)).data;
};
