export type ExerciseExample = {
  name: string;
  category: string;
  equipment: string;
  muscles: string;
  cues: string[];
};

export const EXERCISE_EXAMPLES: ExerciseExample[] = [
  {
    name: 'Goblet squat',
    category: 'Squat',
    equipment: 'Dumbbell or kettlebell',
    muscles: 'Quads, glutes, core',
    cues: ['Keep the weight close to your chest.', 'Sit between your hips and keep knees tracking over toes.'],
  },
  {
    name: 'Bench press',
    category: 'Push',
    equipment: 'Barbell and bench',
    muscles: 'Chest, shoulders, triceps',
    cues: ['Set shoulder blades down and back.', 'Touch the bar under control, then press through the floor.'],
  },
  {
    name: 'Romanian deadlift',
    category: 'Hinge',
    equipment: 'Barbell or dumbbells',
    muscles: 'Hamstrings, glutes, back',
    cues: ['Push hips back before bending the knees.', 'Keep the weight close and stop when hamstrings are loaded.'],
  },
  {
    name: 'Pull-up or lat pulldown',
    category: 'Pull',
    equipment: 'Pull-up bar or cable station',
    muscles: 'Lats, upper back, biceps',
    cues: ['Start each rep with the shoulders packed.', 'Drive elbows toward your ribs instead of chasing the bar.'],
  },
  {
    name: 'Dumbbell press',
    category: 'Push',
    equipment: 'Dumbbells',
    muscles: 'Chest, shoulders, triceps',
    cues: ['Use a stable bench and neutral wrist.', 'Lower with control, then press both bells evenly.'],
  },
  {
    name: 'Reverse lunge',
    category: 'Single-leg',
    equipment: 'Bodyweight or dumbbells',
    muscles: 'Quads, glutes, adductors',
    cues: ['Step back softly and keep the front foot planted.', 'Stand tall by pushing through the front leg.'],
  },
  {
    name: 'Plank',
    category: 'Core',
    equipment: 'Bodyweight',
    muscles: 'Abs, glutes, shoulders',
    cues: ['Brace as if preparing for a punch.', 'Keep ribs and hips stacked without sagging.'],
  },
  {
    name: 'Mountain climber',
    category: 'Conditioning',
    equipment: 'Bodyweight',
    muscles: 'Core, shoulders, hip flexors',
    cues: ['Stack hands under shoulders.', 'Drive knees fast while keeping the torso quiet.'],
  },
  {
    name: 'Back squat',
    category: 'Squat',
    equipment: 'Barbell',
    muscles: 'Quads, glutes, trunk',
    cues: ['Brace before each descent.', 'Keep mid-foot pressure as you stand.'],
  },
  {
    name: 'Barbell row',
    category: 'Pull',
    equipment: 'Barbell',
    muscles: 'Lats, upper back, biceps',
    cues: ['Hinge until the torso is stable.', 'Pull elbows back without jerking the chest up.'],
  },
];

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const findExerciseExample = (name: string) => {
  const normalized = normalizeName(name);
  return EXERCISE_EXAMPLES.find((example) => {
    const exampleName = normalizeName(example.name);
    return normalized === exampleName || normalized.includes(exampleName) || exampleName.includes(normalized);
  });
};

export const getExerciseDemoUrl = (name: string) => {
  const terms = encodeURIComponent(`${name} exercise form tutorial`);
  return `https://www.youtube.com/results?search_query=${terms}`;
};
