import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, ARCJET_KEY, NODE_ENV, DB_URI } = process.env;
