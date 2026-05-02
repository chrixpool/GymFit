import { CompletedDay, CompletedExercise, WeeklyProgress } from '../types/workout';
import { getCurrentUser } from './auth';
import { getWeekDateKeys, toDateKey } from './date';
import { supabase } from './supabase';

const PROGRESS_COLUMNS = 'date, day, focus, completed, exercises';

type ProgressRow = {
  date: string;
  day: string;
  focus: string;
  completed: boolean;
  exercises: Partial<CompletedExercise>[] | null;
};

const getUserId = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No logged-in user.');
  }

  return user.id;
};

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

const toCompletedDay = (row: ProgressRow): CompletedDay => ({
  date: row.date,
  day: row.day,
  focus: row.focus,
  completed: Boolean(row.completed),
  exercises: Array.isArray(row.exercises) ? row.exercises.map(normalizeExercise) : [],
});

const toProgressRow = (day: CompletedDay, userId: string) => {
  const normalized = normalizeDay(day);

  return {
    user_id: userId,
    date: normalized.date,
    day: normalized.day,
    focus: normalized.focus,
    completed: normalized.completed,
    exercises: normalized.exercises,
    updated_at: new Date().toISOString(),
  };
};

export const getProgress = async (): Promise<CompletedDay[]> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('workout_progress')
    .select(PROGRESS_COLUMNS)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('day', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as ProgressRow[]).map(toCompletedDay);
};

export const saveProgress = async (data: CompletedDay[]) => {
  const userId = await getUserId();
  const rows = data.map((day) => toProgressRow(day, userId));

  if (rows.length === 0) return;

  const { error } = await supabase.from('workout_progress').upsert(rows, { onConflict: 'user_id,date,day' });

  if (error) throw error;
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
