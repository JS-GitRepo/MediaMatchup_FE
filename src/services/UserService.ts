import axios from "axios";
import UserAccount from "../models/UserAccount";

const baseURL: string = `${import.meta.env.VITE_API_URL}/user` || "";

export const getUserById = async (uid: string): Promise<UserAccount | null> => {
  return (await axios.get(baseURL, { params: { uid: uid } })).data;
};

export const getUserByEmail = async (
  email: string
): Promise<UserAccount | null> => {
  return (await axios.get(baseURL, { params: { email: email } })).data;
};

export const createUserByID = async (
  user: UserAccount
): Promise<UserAccount> => {
  return (await axios.post(baseURL, user)).data;
};

export const updateUserDailiesByID = async (
  uid: string,
  updateParams: any
): Promise<UserAccount> => {
  return (await axios.put(`${baseURL}/${uid}`, updateParams)).data;
};

export const addFriend = async (uid: string, newFriend: any) => {
  return (await axios.put(`${baseURL}/${uid}/addfriend`, newFriend)).data;
};
