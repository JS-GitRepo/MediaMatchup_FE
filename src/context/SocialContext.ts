import { User } from "firebase/auth";
import { createContext } from "react";

export interface SocialContextModel {
  isFriendFeed: boolean;
  setIsFriendFeed: any;
  user: User | null;
}
const defaultValue: SocialContextModel = {
  isFriendFeed: false,
  setIsFriendFeed: undefined,
  user: null,
};
const SocialContext = createContext(defaultValue);
export default SocialContext;
