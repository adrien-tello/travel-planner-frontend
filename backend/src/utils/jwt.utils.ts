import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { JWTPayload } from "../types/auth";

const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "fallback-secret-change-this";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "3d";

export class JWTUtil {
  static generate(payload: JWTPayload): string {
    return jwt.sign(payload as string | object | Buffer, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as SignOptions);
  }

  static verify(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  static decode(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}