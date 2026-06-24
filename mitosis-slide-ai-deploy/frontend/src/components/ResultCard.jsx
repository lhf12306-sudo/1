import ScorePanel from "./ScorePanel";

export default function ResultCard({ result, onReset }) {
  return (
    <section className="result-card" aria-live="polite">
      <div className="result-header">
        <div>
          <span className="eyebrow">AI ANALYSIS REPORT</span>
          <h2>装片评价报告</h2>
        </div>
        <div className={`level-badge level-${result.overallLevel}`}>
          {result.overallLevel}
        </div>
      </div>

      <div className="result-overview">
        <div className="total-score">
          <span>总分</span>
          <strong>{result.totalScore}</strong>
          <small>/ 100</small>
        </div>
        <ScorePanel scores={result.scores} />
      </div>

      <div className="feedback-grid">
        <FeedbackBlock
          title="主要问题"
          items={result.problems}
          tone="problem"
        />
        <FeedbackBlock
          title="改进建议"
          items={result.suggestions}
          tone="suggestion"
        />
      </div>

      <div className="teacher-comment">
        <span>教师风格点评</span>
        <p>“{result.teacherComment}”</p>
      </div>

      <button type="button" className="reset-button" onClick={onReset}>
        重新上传
      </button>
    </section>
  );
}

function FeedbackBlock({ title, items, tone }) {
  return (
    <div className={`feedback-block ${tone}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

