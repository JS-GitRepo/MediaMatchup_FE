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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // useEffect to only register once at start
    return auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  useEffect(() => {
    if (user) {
      getUserById(user.uid).then((response) => {
        if (!response) {
          let newUser: UserAccount = {
            uid: user.uid,
            name: user.displayName!,
            email: user.email!,
            photoURL: user.photoURL!,
          };
          createUserByID(newUser!);
        }
      });
    }
  }, [user]);

  return (
    <SocialContext.Provider value={{ user, isFriendFeed, setIsFriendFeed }}>
      {children}
    </SocialContext.Provider>
  );
};

export default SocialContextProvider;
