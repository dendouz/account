import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { config } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";
import type { AuthPayload } from "../middleware/auth.js";

const prisma = new PrismaClient();

export async function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentStatus: string;
  region: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError(409, "Un compte existe déjà avec cet email");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      studentStatus: data.studentStatus as any,
      region: data.region as any,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      studentStatus: true,
      region: true,
      language: true,
      birthDate: true,
      createdAt: true,
    },
  });

  const tokens = generateTokens({ userId: user.id, email: user.email });

  // Create default obligations for the user
  await assignDefaultObligations(user.id, data.studentStatus, data.region);

  return { user, ...tokens };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "Email ou mot de passe incorrect");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Email ou mot de passe incorrect");
  }

  const tokens = generateTokens({ userId: user.id, email: user.email });
  const { passwordHash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, ...tokens };
}

export async function refreshToken(token: string) {
  try {
    const payload = jwt.verify(token, config.jwt.refreshSecret) as AuthPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw new AppError(401, "Utilisateur introuvable");
    }
    return generateTokens({ userId: user.id, email: user.email });
  } catch {
    throw new AppError(401, "Token de rafraîchissement invalide");
  }
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      studentStatus: true,
      region: true,
      language: true,
      birthDate: true,
      createdAt: true,
    },
  });
  if (!user) {
    throw new AppError(404, "Utilisateur introuvable");
  }
  return user;
}

export async function updateProfile(
  userId: string,
  data: { firstName?: string; lastName?: string; studentStatus?: string; region?: string; language?: string; birthDate?: string },
) {
  const updateData: any = {};
  if (data.firstName) updateData.firstName = data.firstName;
  if (data.lastName) updateData.lastName = data.lastName;
  if (data.studentStatus) updateData.studentStatus = data.studentStatus;
  if (data.region) updateData.region = data.region;
  if (data.language) updateData.language = data.language;
  if (data.birthDate) updateData.birthDate = new Date(data.birthDate);

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      studentStatus: true,
      region: true,
      language: true,
      birthDate: true,
      createdAt: true,
    },
  });
  return user;
}

function generateTokens(payload: AuthPayload) {
  const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiry as any });
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiry as any });
  return { accessToken, refreshToken };
}

async function assignDefaultObligations(userId: string, studentStatus: string, region: string) {
  const obligations = await prisma.obligation.findMany({
    where: {
      OR: [
        { studentStatuses: { has: studentStatus as any } },
        { studentStatuses: { isEmpty: true } },
      ],
    },
  });

  const relevantObligations = obligations.filter(
    (o) => o.regions.length === 0 || o.regions.includes(region as any),
  );

  if (relevantObligations.length > 0) {
    await prisma.userObligation.createMany({
      data: relevantObligations.map((o) => ({
        userId,
        obligationId: o.id,
      })),
      skipDuplicates: true,
    });
  }
}
