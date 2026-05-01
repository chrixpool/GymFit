import { Day, Goal, WeeklyPlan } from '../types/workout';

const BASE_DAYS: Record<Goal, Day[]> = {
  'lose weight': [
    {
      day: 'Day 1',
      focus: 'Full-body burn',
      durationMinutes: 42,
      exercises: [
        { name: 'Goblet squat', sets: 4, reps: '10-12', restSeconds: 60 },
        { name: 'Incline push-up', sets: 3, reps: '10-15', restSeconds: 45 },
        { name: 'Dumbbell row', sets: 3, reps: '10 each side', restSeconds: 45 },
        { name: 'Reverse lunge', sets: 3, reps: '10 each leg', restSeconds: 45 },
        { name: 'Plank', sets: 3, reps: '35 sec', restSeconds: 35 },
      ],
    },
    {
      day: 'Day 2',
      focus: 'Cardio intervals',
      durationMinutes: 35,
      exercises: [
        { name: 'Bike sprint', sets: 8, reps: '30 sec', restSeconds: 60 },
        { name: 'Kettlebell deadlift', sets: 4, reps: '12', restSeconds: 60 },
        { name: 'Step-up', sets: 3, reps: '12 each leg', restSeconds: 45 },
        { name: 'Mountain climber', sets: 3, reps: '30 sec', restSeconds: 30 },
      ],
    },
    {
      day: 'Day 3',
      focus: 'Strength circuit',
      durationMinutes: 40,
      exercises: [
        { name: 'Romanian deadlift', sets: 4, reps: '10', restSeconds: 60 },
        { name: 'Seated cable row', sets: 3, reps: '12', restSeconds: 45 },
        { name: 'Dumbbell press', sets: 3, reps: '10', restSeconds: 45 },
        { name: 'Farmer carry', sets: 4, reps: '30 m', restSeconds: 45 },
      ],
    },
  ],
  'gain muscle': [
    {
      day: 'Day 1',
      focus: 'Upper push',
      durationMinutes: 55,
      exercises: [
        { name: 'Bench press', sets: 4, reps: '6-8', restSeconds: 120 },
        { name: 'Incline dumbbell press', sets: 3, reps: '8-10', restSeconds: 90 },
        { name: 'Overhead press', sets: 3, reps: '8', restSeconds: 90 },
        { name: 'Cable fly', sets: 3, reps: '12-15', restSeconds: 60 },
        { name: 'Triceps rope pressdown', sets: 3, reps: '12', restSeconds: 60 },
      ],
    },
    {
      day: 'Day 2',
      focus: 'Lower body',
      durationMinutes: 58,
      exercises: [
        { name: 'Back squat', sets: 5, reps: '5', restSeconds: 150 },
        { name: 'Romanian deadlift', sets: 4, reps: '8', restSeconds: 120 },
        { name: 'Leg press', sets: 3, reps: '10', restSeconds: 90 },
        { name: 'Hamstring curl', sets: 3, reps: '12', restSeconds: 60 },
        { name: 'Standing calf raise', sets: 4, reps: '12-15', restSeconds: 45 },
      ],
    },
    {
      day: 'Day 3',
      focus: 'Upper pull',
      durationMinutes: 52,
      exercises: [
        { name: 'Pull-up or lat pulldown', sets: 4, reps: '6-10', restSeconds: 90 },
        { name: 'Barbell row', sets: 4, reps: '8', restSeconds: 90 },
        { name: 'Single-arm cable row', sets: 3, reps: '10 each side', restSeconds: 60 },
        { name: 'Face pull', sets: 3, reps: '15', restSeconds: 45 },
        { name: 'Dumbbell curl', sets: 3, reps: '10-12', restSeconds: 60 },
      ],
    },
    {
      day: 'Day 4',
      focus: 'Hypertrophy mix',
      durationMinutes: 48,
      exercises: [
        { name: 'Front squat', sets: 3, reps: '8', restSeconds: 90 },
        { name: 'Dumbbell bench press', sets: 3, reps: '10', restSeconds: 75 },
        { name: 'Chest-supported row', sets: 3, reps: '10', restSeconds: 75 },
        { name: 'Walking lunge', sets: 3, reps: '12 each leg', restSeconds: 60 },
      ],
    },
  ],
  maintain: [
    {
      day: 'Day 1',
      focus: 'Total body strength',
      durationMinutes: 45,
      exercises: [
        { name: 'Trap bar deadlift', sets: 4, reps: '5', restSeconds: 120 },
        { name: 'Push-up', sets: 3, reps: 'AMRAP', restSeconds: 60 },
        { name: 'Lat pulldown', sets: 3, reps: '10', restSeconds: 60 },
        { name: 'Split squat', sets: 3, reps: '10 each leg', restSeconds: 60 },
      ],
    },
    {
      day: 'Day 2',
      focus: 'Conditioning',
      durationMinutes: 32,
      exercises: [
        { name: 'Row machine', sets: 6, reps: '250 m', restSeconds: 60 },
        { name: 'Dumbbell thruster', sets: 3, reps: '10', restSeconds: 60 },
        { name: 'Side plank', sets: 3, reps: '30 sec each side', restSeconds: 30 },
      ],
    },
    {
      day: 'Day 3',
      focus: 'Mobility and pump',
      durationMinutes: 38,
      exercises: [
        { name: 'Goblet squat', sets: 3, reps: '12', restSeconds: 60 },
        { name: 'Landmine press', sets: 3, reps: '10 each side', restSeconds: 60 },
        { name: 'Cable row', sets: 3, reps: '12', restSeconds: 60 },
        { name: 'Sled push', sets: 5, reps: '20 m', restSeconds: 60 },
      ],
    },
  ],
  'body strength': [
    {
      day: 'Day 1',
      focus: 'Squat strength',
      durationMinutes: 60,
      exercises: [
        { name: 'Back squat', sets: 5, reps: '3-5', restSeconds: 180 },
        { name: 'Paused squat', sets: 3, reps: '4', restSeconds: 150 },
        { name: 'Romanian deadlift', sets: 4, reps: '6', restSeconds: 120 },
        { name: 'Weighted plank', sets: 3, reps: '30 sec', restSeconds: 60 },
      ],
    },
    {
      day: 'Day 2',
      focus: 'Press strength',
      durationMinutes: 55,
      exercises: [
        { name: 'Bench press', sets: 5, reps: '3-5', restSeconds: 180 },
        { name: 'Overhead press', sets: 4, reps: '5', restSeconds: 150 },
        { name: 'Weighted dip', sets: 3, reps: '6-8', restSeconds: 120 },
        { name: 'Triceps extension', sets: 3, reps: '10', restSeconds: 60 },
      ],
    },
    {
      day: 'Day 3',
      focus: 'Pull strength',
      durationMinutes: 58,
      exercises: [
        { name: 'Deadlift', sets: 5, reps: '3', restSeconds: 180 },
        { name: 'Weighted pull-up', sets: 4, reps: '5', restSeconds: 150 },
        { name: 'Barbell row', sets: 4, reps: '6', restSeconds: 120 },
        { name: 'Farmer carry', sets: 4, reps: '40 m', restSeconds: 90 },
      ],
    },
  ],
};

const getLevel = (bmi: number): WeeklyPlan['level'] => {
  if (bmi < 18.5 || bmi >= 30) return 'Foundation';
  if (bmi >= 25) return 'Balanced';
  return 'Performance';
};

const getTitle = (goal: Goal) => {
  switch (goal) {
    case 'lose weight':
      return 'Fat-loss conditioning plan';
    case 'gain muscle':
      return 'Muscle-building split';
    case 'body strength':
      return 'Strength-focused plan';
    default:
      return 'Balanced fitness plan';
  }
};

export const generatePlan = (bmi: number, goal: Goal): WeeklyPlan => {
  const schedule = BASE_DAYS[goal] ?? BASE_DAYS.maintain;
  const level = getLevel(bmi);

  return {
    title: getTitle(goal),
    level,
    daysPerWeek: schedule.length,
    summary: `${schedule.length} focused sessions with built-in recovery and progress tracking.`,
    schedule,
  };
};
