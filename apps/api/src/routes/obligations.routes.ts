import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import * as obligationsService from "../services/obligations.service.js";

const router = Router();

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "DONE", "SKIPPED"]),
});

router.use(authenticate);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const obligations = await obligationsService.listUserObligations(req.user!.userId);
    res.json({ success: true, data: obligations });
  } catch (err) {
    next(err);
  }
});

router.put("/:obligationId/status", validate(updateStatusSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await obligationsService.updateObligationStatus(
      req.user!.userId,
      req.params.obligationId,
      req.body.status,
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
