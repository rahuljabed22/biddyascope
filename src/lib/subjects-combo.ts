import type { Subject } from "./types";

export interface SubjectCombo {
  id: string;
  subjectIds: [string, string];
  label: string;
  labelBn: string;
  priority: number;
}

interface RecommendedRule {
  matchA: string;
  matchB: string;
  priority: number;
}

const RECOMMENDED_RULES: RecommendedRule[] = [
  {
    matchA: "physics",
    matchB: "math",
    priority: 1,
  },
  {
    matchA: "biology",
    matchB: "chemistry",
    priority: 2,
  },
  {
    matchA: "physics",
    matchB: "chemistry",
    priority: 3,
  },
  {
    matchA: "chemistry",
    matchB: "math",
    priority: 4,
  },
];

const EXCLUDED_PAIRS: Array<[string, string]> = [
  ["physics", "biology"],
  ["পদার্থ", "জীব"],
  ["math", "biology"],
  ["গণিত", "জীব"],
];

function isExcludedCombo(a: Subject, b: Subject): boolean {
  const nameA = `${a.id} ${a.name} ${a.nameBn || ""}`.toLowerCase();
  const nameB = `${b.id} ${b.name} ${b.nameBn || ""}`.toLowerCase();

  return EXCLUDED_PAIRS.some(
    ([first, second]) =>
      (nameA.includes(first) && nameB.includes(second)) ||
      (nameA.includes(second) && nameB.includes(first))
  );
}

function findRecommendedRule(a: Subject, b: Subject): RecommendedRule | null {
  const nameA = `${a.id} ${a.name}`.toLowerCase();
  const nameB = `${b.id} ${b.name}`.toLowerCase();

  for (const rule of RECOMMENDED_RULES) {
    const forward = nameA.includes(rule.matchA) && nameB.includes(rule.matchB);
    const reverse = nameA.includes(rule.matchB) && nameB.includes(rule.matchA);
    if (forward || reverse) {
      return rule;
    }
  }
  return null;
}

export function buildTwoSubjectCombos(subjects: Subject[]): SubjectCombo[] {
  const combos: SubjectCombo[] = [];

  for (let i = 0; i < subjects.length; i++) {
    for (let j = i + 1; j < subjects.length; j++) {
      const a = subjects[i];
      const b = subjects[j];
      if (isExcludedCombo(a, b)) {
        continue;
      }

      const rule = findRecommendedRule(a, b);
      const id = `combo:${a.id}__${b.id}`;
      const labelA = a.name;
      const labelB = b.name;
      const bnA = a.nameBn || a.name;
      const bnB = b.nameBn || b.name;

      combos.push({
        id,
        subjectIds: [a.id, b.id],
        label: `${labelA} + ${labelB}`,
        labelBn: `${bnA} + ${bnB}`,
        priority: rule ? rule.priority : 50 + i * 10 + j,
      });
    }
  }

  return combos.sort((x, y) => x.priority - y.priority);
}
