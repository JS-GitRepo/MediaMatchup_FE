import { Matchup } from "./Matchup";

export default interface DailyMatchupCollection {
  _id?: string;
  detailedDate: number;
  simpleDate: number;
  matchups: Matchup[];
}
