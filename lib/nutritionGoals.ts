import type { NutritionTargets } from '../types/workout';
import { getAccountStorageKey } from './accounts';
import { readJson, writeJson } from './storage';

const TARGET_OVERRIDES_NAMESPACE = 'nutrition-target-overrides';

const getTargetOverridesKey = async () => getAccountStorageKey(TARGET_OVERRIDES_NAMESPACE);

const normalizeTargets = (targets: Partial<NutritionTargets>): Partial<NutritionTargets> => {
  const next: Partial<NutritionTargets> = {};

  (['calories', 'protein', 'carbs', 'fat'] as const).forEach((key) => {
    const value = Number(targets[key]);
    if (Number.isFinite(value) && value > 0) next[key] = Math.round(value);
  });

  return next;
};

export const getNutritionTargetOverrides = async () => {
  const key = await getTargetOverridesKey();
  const overrides = await readJson<Partial<NutritionTargets>>(key, {});
  return normalizeTargets(overrides);
};

export const saveNutritionTargetOverrides = async (targets: Partial<NutritionTargets>) => {
  const key = await getTargetOverridesKey();
  await writeJson(key, normalizeTargets(targets));
};

export const clearNutritionTargetOverrides = async () => {
  const key = await getTargetOverridesKey();
  await writeJson(key, {});
};

export const getResolvedNutritionTargets = async (base: NutritionTargets) => {
  const overrides = await getNutritionTargetOverrides();
  return { ...base, ...overrides };
};
