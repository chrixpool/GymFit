import { Goal, NutritionTargets } from '../types/workout';

const BASE_CALORIES: Record<Goal, number> = {
  'lose weight': 1800,
  'gain muscle': 2600,
  maintain: 2200,
  'body strength': 2500,
};

export const getNutritionTargets = (bmi: number, goal: Goal): NutritionTargets => {
  const safeBmi = Number.isFinite(bmi) ? bmi : 22;
  let calories = BASE_CALORIES[goal] ?? BASE_CALORIES.maintain;

  if (safeBmi >= 30) calories -= goal === 'gain muscle' ? 100 : 200;
  if (safeBmi < 18.5) calories += 200;

  const proteinRatio = goal === 'gain muscle' || goal === 'body strength' ? 0.32 : 0.3;
  const fatRatio = goal === 'lose weight' ? 0.28 : 0.3;
  const carbRatio = 1 - proteinRatio - fatRatio;

  return {
    calories,
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9),
  };
};
