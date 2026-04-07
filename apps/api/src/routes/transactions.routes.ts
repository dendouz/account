import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import * as txService from "../services/transactions.service.js";

const router = Router();

const createTxSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive("Le montant doit être positif"),
  category: z.string().min(1, "Catégorie requise"),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date: YYYY-MM-DD"),
  documentId: z.string().uuid().optional(),
});

const updateTxSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  amount: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  documentId: z.string().uuid().nullable().optional(),
});

router.use(authenticate);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      type: req.query.type as string | undefined,
      year: req.query.year ? parseInt(req.query.year as string, 10) : undefined,
      month: req.query.month ? parseInt(req.query.month as string, 10) : undefined,
      category: req.query.category as string | undefined,
    };
    const transactions = await txService.listTransactions(req.user!.userId, filters);
    res.json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(createTxSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.createTransaction(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: tx });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", validate(updateTxSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.updateTransaction(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, data: tx });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await txService.deleteTransaction(req.user!.userId, req.params.id);
    res.json({ success: true, message: "Transaction supprimée" });
  } catch (err) {
    next(err);
  }
});

router.get("/summary", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const summary = await txService.getTransactionSummary(req.user!.userId, year);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

export default router;
