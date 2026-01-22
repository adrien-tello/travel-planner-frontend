"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const data = req.body;
            // Validate required fields
            if (!data.name || !data.email || !data.password) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email, and password are required",
                });
            }
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format",
                });
            }
            //Call services
            const result = await authService.register(data);
            return res.status(201).json({
                success: true,
                message: "Registration successful",
                data: result,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Registration failed",
            });
        }
    }
    async login(req, res) {
        try {
            const data = req.body;
            // Validate required fields
            if (!data.email || !data.password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required",
                });
            }
            const result = await authService.login(data);
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message || "Login failed",
            });
        }
    }
    async getMe(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const userId = req.user.userId;
            const user = await authService.getMe(userId);
            return res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "User not found",
            });
        }
    }
    async logout(req, res) {
        // For JWT, logout is handled client-side by removing the token
        // You can add token blacklisting here if needed
        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    }
}
exports.AuthController = AuthController;
