import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unlink } from "node:fs/promises";
import { analyzeMitosisSlideImage } from "../services/aiService.js";
import { validateResult } from "../validators/resultValidator.js";

const router = Router();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(currentDirectory, "../uploads");

const upload = multer({
  dest: uploadDirectory,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("文件格式错误：只允许上传 JPG 或 PNG 图片。");
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

router.post("/", upload.single("image"), async (request, response, next) => {
  if (!request.file) {
    return response.status(400).json({
      success: false,
      message: "未检测到图片，请使用字段名 image 上传文件。",
    });
  }

  try {
    const result = await analyzeMitosisSlideImage(request.file.path);
    const validation = validateResult(result);

    if (!validation.valid) {
      const error = new Error(`AI 返回结果格式不正确：${validation.errors.join("；")}`);
      error.status = 502;
      throw error;
    }

    return response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  } finally {
    try {
      await unlink(request.file.path);
    } catch (cleanupError) {
      if (cleanupError.code !== "ENOENT") {
        console.error("Failed to delete temporary upload:", cleanupError);
      }
    }
  }
});

export default router;

