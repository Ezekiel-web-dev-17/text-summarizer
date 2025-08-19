"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_URI = exports.NODE_ENV = exports.ARCJET_KEY = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
_a = process.env, exports.PORT = _a.PORT, exports.ARCJET_KEY = _a.ARCJET_KEY, exports.NODE_ENV = _a.NODE_ENV, exports.DB_URI = _a.DB_URI;
