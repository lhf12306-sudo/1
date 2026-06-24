import { stat } from "node:fs/promises";

const scoreTemplates = [
  {
    scores: {
      clarity: 18,
      staining: 17,
      cellDensity: 13,
      mitoticVisibility: 22,
      fieldSelection: 18,
    },
    problems: [
      "视野边缘存在轻微失焦，个别细胞轮廓不够锐利。",
      "染色深浅略有差异，但不影响主要分裂相判断。",
    ],
    suggestions: [
      "拍摄前使用细准焦螺旋再次确认中央与边缘区域的清晰度。",
      "染色时保持滴液量和作用时间一致，并充分冲洗浮色。",
    ],
    teacherComment:
      "装片整体质量优秀，细胞结构和分裂相辨识度较高。若进一步统一染色并改善边缘清晰度，可达到更稳定的观察效果。",
  },
  {
    scores: {
      clarity: 16,
      staining: 15,
      cellDensity: 12,
      mitoticVisibility: 19,
      fieldSelection: 16,
    },
    problems: [
      "部分区域焦点略有偏移，细胞核细节不够清楚。",
      "当前视野中的典型分裂相数量还可以增加。",
    ],
    suggestions: [
      "拍摄前再次微调细准焦螺旋，并保持手机镜头与目镜同轴。",
      "沿根尖分生区缓慢移动装片，选择分裂相更集中的视野。",
    ],
    teacherComment:
      "装片整体质量良好，已经能够支持有丝分裂观察。继续优化清晰度和视野选择，评价结果会更加理想。",
  },
  {
    scores: {
      clarity: 13,
      staining: 12,
      cellDensity: 10,
      mitoticVisibility: 15,
      fieldSelection: 13,
    },
    problems: [
      "图像整体对焦不够稳定，部分细胞边界较模糊。",
      "染色对比度偏低，染色体与周围结构区分不够明显。",
    ],
    suggestions: [
      "重新压片时减少组织重叠，并从低倍镜开始逐级调焦。",
      "适当优化染色时间，选取根尖分生区作为主要观察区域。",
    ],
    teacherComment:
      "装片已达到基本观察要求，但清晰度和染色对比度仍有提升空间。建议按步骤重新检查取材、解离和压片过程。",
  },
];

function levelForScore(score) {
  if (score >= 85) return "优秀";
  if (score >= 70) return "良好";
  if (score >= 60) return "合格";
  return "需要改进";
}

export async function analyzeWithMock(filePath) {
  const fileInfo = await stat(filePath);

  // 根据文件大小稳定选择一组结果，让 mock 在不同图片间略有变化。
  const template = scoreTemplates[fileInfo.size % scoreTemplates.length];
  const totalScore = Object.values(template.scores).reduce(
    (sum, score) => sum + score,
    0,
  );

  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    overallLevel: levelForScore(totalScore),
    totalScore,
    scores: { ...template.scores },
    problems: [...template.problems],
    suggestions: [...template.suggestions],
    teacherComment: template.teacherComment,
  };
}

