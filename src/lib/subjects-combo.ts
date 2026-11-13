import type { Subject } from "./types";

export interface SubjectCombo {
  id: string;
  subjectIds: [string, string];
  label: string;
  labelBn: string;
  tag: string;
  tagBn: string;
  priority: number;
}

interface RecommendedRule {
  matchA: string;
  matchB: string;
  tag: string;
  tagBn: string;
  priority: number;
}

const RECOMMENDED_RULES: RecommendedRule[] = [
  {
    matchA: "physics",
    matchB: "math",
    tag: "Best Engineering / KUET Combo",
    tagBn: "সেরা ইঞ্জিনিয়ারিং / KUET কম্বো",
    priority: 1,
  },
  {
    matchA: "biology",
    matchB: "chemistry",
    tag: "Best Medical / KMC Combo",
    tagBn: "সেরা মেডিকেল / KMC কম্বো",
    priority: 2,
  },
  {
    matchA: "physics",
    matchB: "chemistry",
    tag: "Core Physical Science Combo",
    tagBn: "কোর ফিজিক্যাল সায়েন্স কম্বো",
    priority: 3,
  },
  {
    matchA: "chemistry",
    matchB: "math",
    tag: "Analytical Science Combo",
    tagBn: "অ্যানালিটিক্যাল সায়েন্স কম্বো",
    priority: 4,
  },
  {
    matchA: "physics",
    matchB: "biology",
    tag: "Balanced Science Combo",
    tagBn: "ব্যালেন্সড সায়েন্স কম্বো",
    priority: 5,
  },
  {
    matchA: "math",
    matchB: "biology",
    tag: "All-Rounder HSC Combo",
    tagBn: "অলরাউন্ডার HSC কম্বো",
    priority: 6,
  },
];

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
        tag: rule ? rule.tag : `${a.level} Custom Combo`,
        tagBn: rule ? rule.tagBn : `${a.level} কম্বিনেশন`,
        priority: rule ? rule.priority : 50 + i * 10 + j,
      });
    }
  }

  return combos.sort((x, y) => x.priority - y.priority);
}
