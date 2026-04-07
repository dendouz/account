import { PrismaClient, DocumentType } from "@prisma/client";
import { AppError } from "../middleware/errorHandler.js";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function listDocuments(userId: string, type?: string) {
  const where: any = { userId };
  if (type) where.type = type;

  return prisma.document.findMany({
    where,
    orderBy: { uploadedAt: "desc" },
  });
}

export async function createDocument(
  userId: string,
  data: { type: string; fileName: string; filePath: string },
) {
  return prisma.document.create({
    data: {
      userId,
      type: data.type as DocumentType,
      fileName: data.fileName,
      filePath: data.filePath,
    },
  });
}

export async function getDocument(userId: string, id: string) {
  const doc = await prisma.document.findFirst({ where: { id, userId } });
  if (!doc) {
    throw new AppError(404, "Document introuvable");
  }
  return doc;
}

export async function deleteDocument(userId: string, id: string) {
  const doc = await prisma.document.findFirst({ where: { id, userId } });
  if (!doc) {
    throw new AppError(404, "Document introuvable");
  }

  // Remove file from disk
  try {
    await fs.unlink(doc.filePath);
  } catch {
    // File may already be deleted; continue
  }

  return prisma.document.delete({ where: { id } });
}
