"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
        accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    }).$extends((0, extension_accelerate_1.withAccelerate)());
};
exports.prisma = global.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    global.prisma = exports.prisma;
