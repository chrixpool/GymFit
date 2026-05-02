export type ExerciseExample = {
  name: string;
  cues: string[];
  youtubeId?: string;
  fallbackQuery: string;
};

export const EXERCISE_EXAMPLES: ExerciseExample[] = [
  {
    name: 'Goblet squat',
    cues: ['Keep the weight close to your chest.', 'Sit between your hips and keep knees tracking over toes.'],
    youtubeId: 'nfX7IFK9UNI',
    fallbackQuery: 'goblet squat exercise form tutorial',
  },
  {
    name: 'Bench press',
    cues: ['Set shoulder blades down and back.', 'Touch the bar under control, then press through the floor.'],
    fallbackQuery: 'bench press exercise form tutorial',
  },
  {
    name: 'Romanian deadlift',
    cues: ['Push hips back before bending the knees.', 'Keep the weight close and stop when hamstrings are loaded.'],
    youtubeId: 'CQp5I9KgdXI',
    fallbackQuery: 'romanian deadlift exercise form tutorial',
  },
  {
    name: 'Pull-up or lat pulldown',
    cues: ['Start each rep with the shoulders packed.', 'Drive elbows toward your ribs instead of chasing the bar.'],
    fallbackQuery: 'pull up lat pulldown exercise form tutorial',
  },
  {
    name: 'Dumbbell press',
    cues: ['Use a stable bench and neutral wrist.', 'Lower with control, then press both bells evenly.'],
    youtubeId: 'WLTU1j7Ur8M',
    fallbackQuery: 'dumbbell bench press exercise form tutorial',
  },
  {
    name: 'Reverse lunge',
    cues: ['Step back softly and keep the front foot planted.', 'Stand tall by pushing through the front leg.'],
    fallbackQuery: 'reverse lunge exercise form tutorial',
  },
  {
    name: 'Plank',
    cues: ['Brace as if preparing for a punch.', 'Keep ribs and hips stacked without sagging.'],
    fallbackQuery: 'plank exercise form tutorial',
  },
  {
    name: 'Mountain climber',
    cues: ['Stack hands under shoulders.', 'Drive knees fast while keeping the torso quiet.'],
    fallbackQuery: 'mountain climber exercise form tutorial',
  },
  {
    name: 'Back squat',
    cues: ['Brace before each descent.', 'Keep mid-foot pressure as you stand.'],
    fallbackQuery: 'back squat exercise form tutorial',
  },
  {
    name: 'Barbell row',
    cues: ['Hinge until the torso is stable.', 'Pull elbows back without jerking the chest up.'],
    fallbackQuery: 'barbell row exercise form tutorial',
  },
  {
    name: 'Push-up',
    cues: ['Keep the body long from shoulders to heels.', 'Lower under control and press the floor away.'],
    youtubeId: 'WDIpL0pjun0',
    fallbackQuery: 'push up exercise form tutorial',
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

export const getExerciseDemoUrl = (name: string, fallbackQuery?: string) => {
  const terms = encodeURIComponent(fallbackQuery || `${name} exercise form tutorial`);
  return `https://www.youtube.com/results?search_query=${terms}`;
};
