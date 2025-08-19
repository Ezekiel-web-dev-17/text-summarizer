"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const local_config_1 = require("../config/local.config");
const DBConnect = async () => {
    try {
        if (!local_config_1.DB_URI) {
            console.log("DB_URI is not defined.");
            process.exit(0);
        }
        await mongoose_1.default.connect(local_config_1.DB_URI);
        console.log(`Server is running ${local_config_1.NODE_ENV}`);
        console.log("DATABASE connected Successfully. 🛜");
    }
    catch (error) {
        console.log("Error connecting to mongoDB.");
        process.exit(1);
    }
};
exports.DBConnect = DBConnect;
