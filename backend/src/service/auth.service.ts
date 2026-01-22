import { JWTUtil } from "../utils/jwt.utils";
import { PasswordUtil } from "../utils/password.utils";
import {prisma} from "../conf/database"
import { AuthResponse } from "../types/auth";
import { RegisterDTO, LoginDTO } from "../validators/auth.validators";

export class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
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
    const passwordValidation = PasswordUtil.validate(data.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(data.password);

    // Create user
    const user = await prisma.user.create({
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
    const token = JWTUtil.generate({
      userId: user.id,
      email: user.email,
    });


    return {
      user,
      token,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = JWTUtil.generate({
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

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
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