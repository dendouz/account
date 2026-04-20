import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../middleware/auth.js";
import { config } from "../config/index.js";
import * as docsService from "../services/documents.service.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "image/heic",
      "image/heif",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, PDF, HEIC."));
    }
  },
});

router.use(authenticate);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = req.query.type as string | undefined;
    const docs = await docsService.listDocuments(req.user!.userId, type);
    res.json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
});

router.post("/upload", upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "Aucun fichier fourni" });
      return;
    }

    const docType = (req.body.type as string) || "OTHER";
    const doc = await docsService.createDocument(req.user!.userId, {
      type: docType,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await docsService.getDocument(req.user!.userId, req.params.id);
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await docsService.deleteDocument(req.user!.userId, req.params.id);
    res.json({ success: true, message: "Document supprimé" });
  } catch (err) {
    next(err);
  }
});

export default router;
