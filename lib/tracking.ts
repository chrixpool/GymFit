import { CompletedDay, CompletedExercise, WeeklyProgress } from '../types/workout';
import { getAccountStorageKey } from './accounts';
import { getWeekDateKeys, toDateKey } from './date';
import { readJson, writeJson } from './storage';

const PROGRESS_NAMESPACE = 'progress';

const getProgressKey = async () => getAccountStorageKey(PROGRESS_NAMESPACE);

const normalizeExercise = (exercise: Partial<CompletedExercise>): CompletedExercise => ({
  name: exercise.name?.trim() || 'Exercise',
  done: Boolean(exercise.done),
});

const normalizeDay = (day: Partial<CompletedDay>): CompletedDay => ({
  date: day.date ?? toDateKey(),
  day: day.day ?? 'Workout',
  focus: day.focus ?? 'Training',
  completed: Boolean(day.completed),
  exercises: Array.isArray(day.exercises) ? day.exercises.map(normalizeExercise) : [],
});

export const getProgress = async (): Promise<CompletedDay[]> => {
  try {
    const progress = await readJson<Partial<CompletedDay>[]>(await getProgressKey(), []);
    return progress.map(normalizeDay);
  } catch {
    return [];
  }
};

export const saveProgress = async (data: CompletedDay[]) => {
  const key = await getProgressKey();
  await writeJson(key, data.map(normalizeDay));
};

const buildExerciseList = (names: string[], existing: CompletedExercise[]) => {
  if (names.length === 0) return existing;

  return names.map((name) => {
    const match = existing.find((exercise) => exercise.name === name);
    return { name, done: match?.done ?? false };
  });
};

export const toggleExercise = async (
  date: string,
  day: string,
  focus: string,
  exerciseName: string,
  exercisesOrTotal: string[] | number
) => {
  const progress = await getProgress();
  const exerciseNames = Array.isArray(exercisesOrTotal) ? exercisesOrTotal : [];
  const totalExercises = Array.isArray(exercisesOrTotal) ? exercisesOrTotal.length : exercisesOrTotal;

  let entry = progress.find((item) => item.date === date && item.day === day);

  if (!entry) {
    entry = {
      date,
      day,
      focus,
      completed: false,
      exercises: buildExerciseList(exerciseNames, []),
    };
    progress.unshift(entry);
  } else {
    entry.exercises = buildExerciseList(exerciseNames, entry.exercises);
  }

  let exercise = entry.exercises.find((item) => item.name === exerciseName);

  if (!exercise) {
    exercise = { name: exerciseName, done: false };
    entry.exercises.push(exercise);
  }

  exercise.done = !exercise.done;

  const doneCount = entry.exercises.filter((item) => item.done).length;
  entry.completed = totalExercises > 0 && doneCount >= totalExercises;

  await saveProgress(progress);
  return entry;
};

export const getStreak = async () => {
  const progress = await getProgress();
  const doneDays = new Set(progress.filter((item) => item.completed).map((item) => item.date));

  let streak = 0;
  const current = new Date();

  while (doneDays.has(toDateKey(current))) {
    streak += 1;
    current.setDate(current.getDate() - 1);
  }

  return streak;
};

export const getWeeklyProgress = async (): Promise<WeeklyProgress> => {
  const progress = await getProgress();
  const dates = getWeekDateKeys();
  const days = progress.filter((item) => dates.includes(item.date));

  return {
    total: dates.length,
    completed: days.filter((item) => item.completed).length,
    dates,
    days,
  };
};
