export async function analyzeWithOpenAI(filePath) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error(
      "OpenAI Provider 尚未配置：请在服务端环境变量中设置 OPENAI_API_KEY。",
    );
    error.status = 503;
    throw error;
  }

  // TODO:
  // 1. 安装并初始化 OpenAI 官方 Node.js SDK，Key 只能从环境变量读取。
  // 2. 读取 filePath 对应的图片，并转换为模型支持的视觉输入格式。
  // 3. 调用支持图像输入的模型，要求模型严格返回约定的 JSON 结构。
  // 4. 解析模型响应并 return 结果对象。
  // 5. 不要在日志中输出 API Key 或完整的敏感请求内容。

  void filePath;

  const error = new Error("openaiProvider 尚未实现，请先完成 TODO 后再启用。");
  error.status = 501;
  throw error;
}

