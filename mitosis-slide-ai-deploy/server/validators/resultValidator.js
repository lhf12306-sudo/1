const SCORE_LIMITS = {
  clarity: 20,
  staining: 20,
  cellDensity: 15,
  mitoticVisibility: 25,
  fieldSelection: 20,
};

const VALID_LEVELS = ["优秀", "良好", "合格", "需要改进"];

function expectedLevel(score) {
  if (score >= 85) return "优秀";
  if (score >= 70) return "良好";
  if (score >= 60) return "合格";
  return "需要改进";
}

export function validateResult(result) {
  const errors = [];

  if (!result || typeof result !== "object" || Array.isArray(result)) {
    return { valid: false, errors: ["结果必须是一个对象"] };
  }

  if (!VALID_LEVELS.includes(result.overallLevel)) {
    errors.push("overallLevel 不在允许的等级中");
  }

  if (
    !Number.isInteger(result.totalScore) ||
    result.totalScore < 0 ||
    result.totalScore > 100
  ) {
    errors.push("totalScore 必须是 0 到 100 之间的整数");
  }

  if (!result.scores || typeof result.scores !== "object") {
    errors.push("scores 必须是对象");
  } else {
    for (const [key, max] of Object.entries(SCORE_LIMITS)) {
      const value = result.scores[key];
      if (!Number.isInteger(value) || value < 0 || value > max) {
        errors.push(`${key} 必须是 0 到 ${max} 之间的整数`);
      }
    }

    const keys = Object.keys(result.scores);
    const unexpectedKeys = keys.filter((key) => !(key in SCORE_LIMITS));
    if (unexpectedKeys.length) {
      errors.push(`scores 包含未知字段：${unexpectedKeys.join(", ")}`);
    }

    const scoreValues = Object.keys(SCORE_LIMITS).map(
      (key) => result.scores[key],
    );
    if (
      scoreValues.every(Number.isInteger) &&
      scoreValues.reduce((sum, value) => sum + value, 0) !== result.totalScore
    ) {
      errors.push("totalScore 必须等于五项评分之和");
    }
  }

  if (
    Number.isInteger(result.totalScore) &&
    VALID_LEVELS.includes(result.overallLevel) &&
    result.overallLevel !== expectedLevel(result.totalScore)
  ) {
    errors.push("overallLevel 与 totalScore 对应的等级规则不一致");
  }

  for (const field of ["problems", "suggestions"]) {
    if (
      !Array.isArray(result[field]) ||
      result[field].length === 0 ||
      result[field].some(
        (item) => typeof item !== "string" || item.trim().length === 0,
      )
    ) {
      errors.push(`${field} 必须是非空字符串数组`);
    }
  }

  if (
    typeof result.teacherComment !== "string" ||
    result.teacherComment.trim().length === 0
  ) {
    errors.push("teacherComment 必须是非空字符串");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

