import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/local.config";

export const DBConnect = async () => {
  try {
    if (!DB_URI) {
      console.log("DB_URI is not defined.");
      process.exit(0);
    }
    await mongoose.connect(DB_URI);
    console.log(`Server is running ${NODE_ENV}`);
    console.log("DATABASE connected Successfully. 🛜");
  } catch (error) {
    console.log("Error connecting to mongoDB.");
    process.exit(1);
  }
};
