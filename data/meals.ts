import { Goal, MealType } from '../types/workout';

export type TunisianMealCategory = 'cheap-bulking' | 'ramadan' | 'street-food' | 'everyday';

export type TunisianMealTemplate = {
  name: string;
  type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: TunisianMealCategory;
  costDinars: number;
  tags: string[];
  bestFor: Goal[];
};

export const MEAL_TEMPLATES: TunisianMealTemplate[] = [
  {
    name: 'Tuna sandwich',
    type: 'lunch',
    calories: 450,
    protein: 30,
    carbs: 40,
    fat: 15,
    category: 'everyday',
    costDinars: 6,
    tags: ['quick', 'high protein'],
    bestFor: ['lose weight', 'maintain', 'gain muscle'],
  },
  {
    name: 'Ojja eggs',
    type: 'dinner',
    calories: 420,
    protein: 28,
    carbs: 14,
    fat: 27,
    category: 'everyday',
    costDinars: 5,
    tags: ['low carb', 'home'],
    bestFor: ['lose weight', 'maintain'],
  },
  {
    name: 'Lablabi bowl',
    type: 'lunch',
    calories: 520,
    protein: 22,
    carbs: 78,
    fat: 14,
    category: 'street-food',
    costDinars: 4,
    tags: ['street food', 'fiber'],
    bestFor: ['gain muscle', 'maintain', 'body strength'],
  },
  {
    name: 'Greek yogurt and dates',
    type: 'snack',
    calories: 260,
    protein: 18,
    carbs: 34,
    fat: 7,
    category: 'ramadan',
    costDinars: 4,
    tags: ['iftar', 'snack'],
    bestFor: ['lose weight', 'maintain'],
  },
  {
    name: 'Makrouna tuna and harissa',
    type: 'lunch',
    calories: 720,
    protein: 42,
    carbs: 92,
    fat: 18,
    category: 'cheap-bulking',
    costDinars: 7,
    tags: ['cheap bulking', 'high carb'],
    bestFor: ['gain muscle', 'body strength'],
  },
  {
    name: 'Rice, eggs, and olive oil',
    type: 'dinner',
    calories: 680,
    protein: 29,
    carbs: 83,
    fat: 25,
    category: 'cheap-bulking',
    costDinars: 5,
    tags: ['budget', 'home'],
    bestFor: ['gain muscle', 'body strength'],
  },
  {
    name: 'Bsissa milk shake',
    type: 'snack',
    calories: 480,
    protein: 24,
    carbs: 58,
    fat: 17,
    category: 'cheap-bulking',
    costDinars: 4,
    tags: ['budget', 'drink'],
    bestFor: ['gain muscle', 'body strength'],
  },
  {
    name: 'Shorba frik and chicken',
    type: 'dinner',
    calories: 430,
    protein: 31,
    carbs: 48,
    fat: 12,
    category: 'ramadan',
    costDinars: 6,
    tags: ['iftar', 'warm meal'],
    bestFor: ['lose weight', 'maintain', 'gain muscle'],
  },
  {
    name: 'Brik egg and tuna',
    type: 'dinner',
    calories: 390,
    protein: 22,
    carbs: 28,
    fat: 21,
    category: 'ramadan',
    costDinars: 4,
    tags: ['iftar', 'street food'],
    bestFor: ['maintain', 'gain muscle'],
  },
  {
    name: 'Sahri oats, milk, dates',
    type: 'breakfast',
    calories: 610,
    protein: 28,
    carbs: 88,
    fat: 16,
    category: 'ramadan',
    costDinars: 5,
    tags: ['suhoor', 'slow carbs'],
    bestFor: ['gain muscle', 'body strength', 'maintain'],
  },
  {
    name: 'Fricasse tuna',
    type: 'lunch',
    calories: 560,
    protein: 21,
    carbs: 54,
    fat: 28,
    category: 'street-food',
    costDinars: 3,
    tags: ['street food', 'fast'],
    bestFor: ['gain muscle', 'maintain'],
  },
  {
    name: 'Kafteji plate',
    type: 'lunch',
    calories: 690,
    protein: 19,
    carbs: 62,
    fat: 39,
    category: 'street-food',
    costDinars: 5,
    tags: ['street food', 'high fat'],
    bestFor: ['gain muscle', 'body strength'],
  },
  {
    name: 'Grilled chicken mlewi',
    type: 'lunch',
    calories: 640,
    protein: 38,
    carbs: 58,
    fat: 27,
    category: 'street-food',
    costDinars: 8,
    tags: ['street food', 'high protein'],
    bestFor: ['gain muscle', 'maintain', 'body strength'],
  },
];

export const MEAL_CATEGORY_LABELS: Record<TunisianMealCategory | 'all', string> = {
  all: 'All',
  everyday: 'Everyday',
  'cheap-bulking': 'Cheap bulking',
  ramadan: 'Ramadan',
  'street-food': 'Street macros',
};

export const getBudgetMealIdeas = (budgetDinars: number, goal: Goal) => {
  return MEAL_TEMPLATES
    .filter((meal) => meal.costDinars <= budgetDinars && meal.bestFor.includes(goal))
    .sort((a, b) => (b.protein / Math.max(1, b.costDinars)) - (a.protein / Math.max(1, a.costDinars)))
    .slice(0, 4);
};
