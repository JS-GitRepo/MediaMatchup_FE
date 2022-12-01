import { User } from "firebase/auth";
import { createContext } from "react";
import UserAccount from "../models/UserAccount";

export interface SocialContextModel {
  isFriendFeed: boolean;
  setIsFriendFeed: any;
  userAccount: UserAccount | null;
  setUserAccount: any;
  userAuth: User | null;
}
const defaultValue: SocialContextModel = {
  isFriendFeed: false,
  setIsFriendFeed: undefined,
  userAccount: null,
  setUserAccount: undefined,
  userAuth: null,
};
const SocialContext = createContext(defaultValue);
export default SocialContext;
