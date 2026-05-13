import * as z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import {
  authRepository,
  createUserRepository,
  getUserByEmailRepository,
} from "../repositories/auth.repository.js";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const googleSchema = z.object({
  credential: z.string().min(1),
});

const issueAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 4 * 60 * 60 * 1000, // 4 hours
  });
};

const signToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "4h" },
  );
};

const login = async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const { email, password } = result.data;
    const user = await authRepository(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signToken(user);
    issueAuthCookie(res, token);
    res.json({ message: "Login successful", email: user.email });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const { email, password } = result.data;
    const existing = await getUserByEmailRepository(email);
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUserRepository({ email, passwordHash, role: "user" });

    const token = signToken(user);
    issueAuthCookie(res, token);
    res.status(201).json({ message: "Registration successful", email: user.email });
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const result = googleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return res.status(500).json({ error: "Google auth is not configured" });
    }

    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: result.data.credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
      return res.status(401).json({ error: "Google token has no email" });
    }

    let user = await getUserByEmailRepository(email);
    if (!user) {
      // Create a local user record so the rest of the app works unchanged.
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      user = await createUserRepository({ email, passwordHash, role: "user" });
    }

    const token = signToken(user);
    issueAuthCookie(res, token);
    res.json({ message: "Google login successful", email: user.email });
  } catch (err) {
    next(err);
  }
};

export default login;
