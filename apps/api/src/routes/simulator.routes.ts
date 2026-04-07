import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.js";
import * as simulatorService from "../services/simulator.service.js";

const router = Router();

router.use(authenticate);

router.get("/tax", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
    const result = await simulatorService.simulateTax(req.user!.userId, year);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
