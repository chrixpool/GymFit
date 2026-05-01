import { MealType } from '../types/workout';

export const MEAL_TEMPLATES: Array<{
  name: string;
  type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}> = [
  {
    name: 'Tuna sandwich',
    type: 'lunch',
    calories: 450,
    protein: 30,
    carbs: 40,
    fat: 15,
  },
  {
    name: 'Ojja eggs',
    type: 'dinner',
    calories: 420,
    protein: 28,
    carbs: 14,
    fat: 27,
  },
  {
    name: 'Lablabi bowl',
    type: 'lunch',
    calories: 520,
    protein: 22,
    carbs: 78,
    fat: 14,
  },
  {
    name: 'Greek yogurt and dates',
    type: 'snack',
    calories: 260,
    protein: 18,
    carbs: 34,
    fat: 7,
  },
];
