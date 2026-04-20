import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/errorHandler.js";

const prisma = new PrismaClient();

export async function listArticles(category?: string) {
  const where: any = {};
  if (category) where.category = category;

  return prisma.knowledgeArticle.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.knowledgeArticle.findUnique({ where: { slug } });
  if (!article) {
    throw new AppError(404, "Article introuvable");
  }
  return article;
}
