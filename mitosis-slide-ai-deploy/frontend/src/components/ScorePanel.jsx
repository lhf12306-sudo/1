const SCORE_ITEMS = [
  { key: "clarity", label: "图像清晰度", max: 20 },
  { key: "staining", label: "染色效果", max: 20 },
  { key: "cellDensity", label: "细胞密度", max: 15 },
  { key: "mitoticVisibility", label: "分裂相可见度", max: 25 },
  { key: "fieldSelection", label: "视野选择", max: 20 },
];

export default function ScorePanel({ scores }) {
  return (
    <div className="score-list">
      {SCORE_ITEMS.map((item) => {
        const value = scores[item.key];
        const percentage = Math.round((value / item.max) * 100);

        return (
          <div className="score-row" key={item.key}>
            <div className="score-label">
              <span>{item.label}</span>
              <strong>{value}<small> / {item.max}</small></strong>
            </div>
            <div
              className="score-track"
              role="progressbar"
              aria-label={item.label}
              aria-valuemin="0"
              aria-valuemax={item.max}
              aria-valuenow={value}
            >
              <span style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

