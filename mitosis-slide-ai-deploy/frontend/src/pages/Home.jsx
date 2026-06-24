import { useEffect, useState } from "react";
import { analyzeImage } from "../api/analyzeApi";
import ImageUploader from "../components/ImageUploader";
import ResultCard from "../components/ResultCard";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelected = (selectedFile) => {
    setError("");
    setResult(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("请先选择一张需要评价的图片。");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await analyzeImage(file);
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">BIOLOGY · SMART LAB</p>
        <h1>有丝分裂装片<br /><em>AI 评价系统</em></h1>
        <p className="hero-description">
          上传显微镜下的装片图像，快速获得质量评分、问题诊断与针对性改进建议。
        </p>
      </header>

      {!result ? (
        <div className="workspace-card">
          <ImageUploader
            file={file}
            previewUrl={previewUrl}
            disabled={loading}
            onFileSelected={handleFileSelected}
            onError={setError}
          />

          {error && <div className="error-message" role="alert">{error}</div>}

          <button
            type="button"
            className="primary-button"
            disabled={!file || loading}
            onClick={handleAnalyze}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                正在分析装片，请稍候…
              </>
            ) : (
              "开始评价"
            )}
          </button>

          <p className="privacy-note">
            图片仅用于本次分析，后端处理完成后会自动删除临时文件。
          </p>
        </div>
      ) : (
        <ResultCard result={result} onReset={handleReset} />
      )}

      <footer>
        <span>MITOSIS SLIDE EVALUATOR</span>
        <span>教学辅助工具 · 评价结果仅供学习参考</span>
      </footer>
    </main>
  );
}

