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
