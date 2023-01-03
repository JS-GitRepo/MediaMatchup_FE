import { profanity } from "@2toad/profanity";

export const truncateStringTail = (string: string, charCount: number) => {
  if (string.length > charCount) {
    return ".." + string.substring(string.length - charCount);
  } else {
    return string;
  }
};

export const profanityCheck = (string: string) => {
  profanity.removeWords([
    "butt",
    "arse",
    "4r5e",
    "anus",
    "ar5e",
    "arrse",
    "bloody",
    "bollock",
    "bollok",
    "cyalis",
    "muff",
    "pawn",
    "poop",
    "willy",
    "twat",
  ]);
  profanity.addWords([
    "nignog",
    "nig",
    "cvnt",
    "cun7",
    "cvn7",
    "kike",
    "k1ke",
    "k1k3",
    "jew",
  ]);
  return profanity.exists(string);
};

export const generateDateInfo = () => {
  const currentDate: Date = new Date();
  const detailedDate: number = Date.now();
  const simpleDate: number = Date.UTC(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    0,
    0,
    0,
    0
  );
  return { currentDate, detailedDate, simpleDate };
};
