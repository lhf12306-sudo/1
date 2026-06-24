import { useRef } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ImageUploader({
  file,
  previewUrl,
  disabled,
  onFileSelected,
  onError,
}) {
  const inputRef = useRef(null);

  const validateAndSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      onError("文件格式错误：请上传 JPG 或 PNG 图片。");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      onError("文件过大：图片大小不能超过 5MB。");
      return;
    }

    onFileSelected(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (!disabled) validateAndSelect(event.dataTransfer.files?.[0]);
  };

  return (
    <section className="upload-section" aria-labelledby="upload-title">
      <div className="section-heading">
        <span className="step-number">01</span>
        <div>
          <h2 id="upload-title">上传显微图片</h2>
          <p>支持 JPG、PNG，文件大小不超过 5MB</p>
        </div>
      </div>

      <div
        className={`drop-zone ${previewUrl ? "has-preview" : ""}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="preview-wrap">
            <img src={previewUrl} alt="待评价的有丝分裂装片预览" />
            <div className="preview-meta">
              <strong>{file.name}</strong>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon" aria-hidden="true">＋</div>
            <strong>拖放图片到这里</strong>
            <span>或从电脑中选择一张装片照片</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          hidden
          disabled={disabled}
          onChange={(event) => {
            validateAndSelect(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          className="secondary-button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {previewUrl ? "更换图片" : "选择图片"}
        </button>
      </div>
    </section>
  );
}

