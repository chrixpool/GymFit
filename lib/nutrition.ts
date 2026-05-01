import { MealEntry, MealType } from '../types/workout';
import { getAccountStorageKey } from './accounts';
import { toDateKey } from './date';
import { readJson, writeJson } from './storage';

const MEALS_NAMESPACE = 'meals';

const getMealsKey = async () => getAccountStorageKey(MEALS_NAMESPACE);

const normalizeMeal = (meal: Partial<MealEntry>): MealEntry => ({
  id: meal.id ?? `${Date.now()}`,
  type: meal.type ?? 'snack',
  name: meal.name?.trim() || 'Meal',
  calories: Number.isFinite(meal.calories) ? Number(meal.calories) : 0,
  protein: Number.isFinite(meal.protein) ? Number(meal.protein) : 0,
  carbs: Number.isFinite(meal.carbs) ? Number(meal.carbs) : 0,
  fat: Number.isFinite(meal.fat) ? Number(meal.fat) : 0,
  date: meal.date ?? toDateKey(),
});

export const getMeals = async (): Promise<MealEntry[]> => {
  try {
    const meals = await readJson<Partial<MealEntry>[]>(await getMealsKey(), []);
    return meals.map(normalizeMeal);
  } catch {
    return [];
  }
};

export const saveMeals = async (data: MealEntry[]) => {
  const key = await getMealsKey();
  await writeJson(key, data.map(normalizeMeal));
};

export const getTodayMeals = async () => {
  const today = toDateKey();
  const meals = await getMeals();
  return meals.filter((meal) => meal.date === today);
};

export const addMeal = async (meal: Omit<MealEntry, 'id' | 'date'> & { id?: string; date?: string }) => {
  const meals = await getMeals();
  const nextMeal = normalizeMeal({ ...meal, id: meal.id ?? `${Date.now()}`, date: meal.date ?? toDateKey() });
  await saveMeals([nextMeal, ...meals]);
};

export const addQuickMeal = async (meal: {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type?: MealType;
}) => {
  await addMeal({ ...meal, type: meal.type ?? 'snack' });
};

export const deleteMeal = async (id: string) => {
  const meals = await getMeals();
  await saveMeals(meals.filter((meal) => meal.id !== id));
};
