import { Router, Request, Response, NextFunction } from "express";
import * as knowledgeService from "../services/knowledge.service.js";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category as string | undefined;
    const articles = await knowledgeService.listArticles(category);
    res.json({ success: true, data: articles });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await knowledgeService.getArticleBySlug(req.params.slug);
    res.json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
});

export default router;
