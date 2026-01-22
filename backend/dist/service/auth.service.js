"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const password_utils_1 = require("../utils/password.utils");
const database_1 = require("../conf/database");
class AuthService {
    async register(data) {
        // Check if email already exists
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: data.email },
            cacheStrategy: {
                ttl: 60,
                swr: 30,
            },
        });
        if (existingUser) {
            throw new Error("Email already registered");
        }
        // Validate password
        const passwordValidation = password_utils_1.PasswordUtil.validate(data.password);
        if (!passwordValidation.valid) {
            throw new Error(passwordValidation.message);
        }
        // Hash password
        const hashedPassword = await password_utils_1.PasswordUtil.hash(data.password);
        // Create user
        const user = await database_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        // Generate JWT token
        const token = jwt_utils_1.JWTUtil.generate({
            userId: user.id,
            email: user.email,
        });
        return {
            user,
            token,
        };
    }
    async login(data) {
        // Find user by email
        const user = await database_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        // Verify password
        const isPasswordValid = await password_utils_1.PasswordUtil.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // Generate JWT token
        const token = jwt_utils_1.JWTUtil.generate({
            userId: user.id,
            email: user.email,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
    async getMe(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            cacheStrategy: {
                ttl: 120, // cache for 2 minutes
                swr: 60, // refresh in background
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                preferences: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
exports.AuthService = AuthService;
