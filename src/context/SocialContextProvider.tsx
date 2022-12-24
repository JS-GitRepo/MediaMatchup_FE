import { ReactNode, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import SocialContext from "./SocialContext";
import { createUserByID, getUserById } from "../services/UserService";
import UserAccount from "../models/UserAccount";

interface Props {
  children: ReactNode;
}

const SocialContextProvider = ({ children }: Props) => {
  const [isFriendFeed, setIsFriendFeed] = useState<boolean>(false);
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);

  useEffect(() => {
    // useEffect to only register once at start
    return auth.onAuthStateChanged((newUser) => {
      setUserAuth(newUser);
    });
  }, []);

  useEffect(() => {
    if (userAuth) {
      getUserById(userAuth.uid).then((response) => {
        if (!response) {
          let newUserAccount: UserAccount = {
            uid: userAuth.uid,
            name: userAuth.displayName!,
            email: userAuth.email!,
            photoURL: userAuth.photoURL!,
            friends: [],
          };
          setUserAccount(newUserAccount);
          createUserByID(newUserAccount);
        } else {
          setUserAccount(response);
        }
      });
    } else {
      setUserAccount(null);
    }
  }, [userAuth]);

  return (
    <SocialContext.Provider
      value={{
        userAuth,
        isFriendFeed,
        setIsFriendFeed,
        userAccount,
        setUserAccount,
      }}>
      {children}
    </SocialContext.Provider>
  );
};

export default SocialContextProvider;
