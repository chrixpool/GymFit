export type Goal = 'lose weight' | 'gain muscle' | 'maintain' | 'body strength';

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
};

export type Day = {
  day: string;
  focus: string;
  durationMinutes: number;
  exercises: Exercise[];
};

export type WeeklyPlan = {
  title: string;
  level: 'Foundation' | 'Balanced' | 'Performance';
  daysPerWeek: number;
  summary: string;
  schedule: Day[];
};

export type UserProfile = {
  age: string;
  weight: string;
  height: string;
  goal: Goal;
  bmi: string;
};

export type CompletedExercise = {
  name: string;
  done: boolean;
};

export type CompletedDay = {
  date: string;
  day: string;
  focus: string;
  completed: boolean;
  exercises: CompletedExercise[];
};

export type WeeklyProgress = {
  total: number;
  completed: number;
  dates: string[];
  days: CompletedDay[];
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type MealEntry = {
  id: string;
  type: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
};

export type NutritionTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};
