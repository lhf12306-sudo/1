import { analyzeWithMock } from "./mockProvider.js";
import { analyzeWithOpenAI } from "./openaiProvider.js";

const providers = {
  mock: analyzeWithMock,
  openai: analyzeWithOpenAI,
};

export async function analyzeMitosisSlideImage(filePath) {
  const providerName = (process.env.AI_PROVIDER || "mock").toLowerCase();
  const provider = providers[providerName];

  if (!provider) {
    const error = new Error(
      `不支持的 AI_PROVIDER：${providerName}。可选值为 mock 或 openai。`,
    );
    error.status = 500;
    throw error;
  }

  return provider(filePath);
}

