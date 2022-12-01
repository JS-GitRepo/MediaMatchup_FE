import Friend from "./Friend";

export default interface UserAccount {
  _id?: string;
  uid: string;
  name: string;
  handle?: string;
  email: string;
  photoURL: string;
  friends?: Friend[];
  favorites?: [{}];
  dailyMatchupsDate?: number;
  dailyMatchupsIndex?: number;
}
