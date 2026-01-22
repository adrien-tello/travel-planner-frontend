"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-this";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3d";
class JWTUtil {
    /**
     * Generates a JWT token with the given payload.
     * The token will expire in the duration specified by JWT_EXPIRES_IN.
     * @param {JWTPayload} payload - The payload to include in the JWT token.
     * @returns {string} The generated JWT token.
     */
    static generate(payload) {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    }
    /**
     * Verifies a JWT token and returns the payload.
     * @throws {Error} If the token is invalid or expired.
     * @param {string} token - The JWT token to verify.
     * @returns {JWTPayload} The payload of the verified token.
     */
    static verify(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            throw new Error("Invalid or expired token");
        }
    }
    /**
     * Attempts to decode a JWT token and returns the payload if successful.
     * If the token is invalid, expired, or malformed, returns null.
     * @param {string} token - The JWT token to decode.
     * @returns {JWTPayload | null} The payload of the decoded token, or null if decoding fails. **/
    static decode(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            return null;
        }
    }
}
exports.JWTUtil = JWTUtil;
