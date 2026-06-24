import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import analyzeRouter from "./routes/analyze.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`当前前端域名未被允许访问：${origin}`));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    provider: process.env.AI_PROVIDER || "mock",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/analyze", analyzeRouter);

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return response.status(413).json({
        success: false,
        message: "文件过大：图片大小不能超过 5MB。",
      });
    }

    return response.status(400).json({
      success: false,
      message: `图片上传失败：${error.message}`,
    });
  }

  if (error.message?.startsWith("当前前端域名未被允许访问")) {
    return response.status(403).json({
      success: false,
      message: error.message,
    });
  }

  const status = error.status || 500;
  const message =
    status >= 500 ? "服务器处理图片时发生错误，请稍后重试。" : error.message;

  if (status >= 500) {
    console.error(error);
  }

  return response.status(status).json({
    success: false,
    message,
  });
});

app.listen(port, () => {
  console.log(`Mitosis slide AI server is running at http://localhost:${port}`);
  console.log(`AI provider: ${process.env.AI_PROVIDER || "mock"}`);
});
