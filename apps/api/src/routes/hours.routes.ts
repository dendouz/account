import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import * as hoursService from "../services/hours.service.js";

const router = Router();

const createHourSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date: YYYY-MM-DD"),
  hours: z.number().positive("Les heures doivent être positives").max(24, "Maximum 24h par jour"),
  employer: z.string().min(1, "Employeur requis"),
  description: z.string().optional(),
});

const updateHourSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  hours: z.number().positive().max(24).optional(),
  employer: z.string().min(1).optional(),
  description: z.string().optional(),
});

router.use(authenticate);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const hours = await hoursService.listHours(req.user!.userId, year);
    res.json({ success: true, data: hours });
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(createHourSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hour = await hoursService.createHour(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: hour });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", validate(updateHourSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hour = await hoursService.updateHour(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, data: hour });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await hoursService.deleteHour(req.user!.userId, req.params.id);
    res.json({ success: true, message: "Entrée supprimée" });
  } catch (err) {
    next(err);
  }
});

router.get("/summary", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const summary = await hoursService.getHoursSummary(req.user!.userId, year);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

export default router;
