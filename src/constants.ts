const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const FRONTEND_URL = IS_PRODUCTION
  ? "https://anagrams.io"
  : "http://localhost:3001";
