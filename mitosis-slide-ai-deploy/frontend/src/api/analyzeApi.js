const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("无法连接到服务器，请确认后端已启动。");
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("服务器返回了无法识别的响应。");
  }

  if (!response.ok) {
    throw new Error(payload.message || "图片分析失败，请稍后重试。");
  }

  return payload.data;
}

