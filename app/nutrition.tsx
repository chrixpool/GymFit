import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppTheme } from '../constants/theme';
import { MEAL_TEMPLATES } from '../data/meals';
import { addMeal, addQuickMeal, deleteMeal, getTodayMeals } from '../lib/nutrition';
import { getNutritionTargets } from '../lib/nutritionEngine';
import { getProfile } from '../lib/profile';
import { MealEntry, MealType, NutritionTargets } from '../types/workout';

const colors = AppTheme.colors;
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function Nutrition() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [type, setType] = useState<MealType>('lunch');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const [todayMeals, profile] = await Promise.all([getTodayMeals(), getProfile()]);
    setMeals(todayMeals);
    setTargets(profile ? getNutritionTargets(parseFloat(profile.bmi), profile.goal) : null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAdd = async () => {
    const parsedCalories = Number.parseFloat(calories);
    const parsedProtein = Number.parseFloat(protein || '0');

    if (!name.trim()) {
      setError('Add a meal name.');
      return;
    }

    if (!Number.isFinite(parsedCalories) || parsedCalories <= 0) {
      setError('Calories must be greater than zero.');
      return;
    }

    await addMeal({
      type,
      name: name.trim(),
      calories: Math.round(parsedCalories),
      protein: Math.max(0, Math.round(parsedProtein)),
      carbs: 0,
      fat: 0,
    });

    setName('');
    setCalories('');
    setProtein('');
    setError('');
    load();
  };

  const percent = targets ? Math.min(100, Math.round((totals.calories / targets.calories) * 100)) : 0;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="restaurant-outline" size={24} color={colors.text} />
        </View>
        <Text style={styles.title}>Nutrition tracker</Text>
        <Text style={styles.subtitle}>Log meals fast and keep calories visible without spreadsheet energy.</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: percent > 92 ? colors.primary : colors.warning }]} />
        </View>
        <View style={styles.summaryRow}>
          <Macro label="Calories" value={targets ? `${totals.calories}/${targets.calories}` : `${totals.calories}`} color={colors.warning} />
          <Macro label="Protein" value={targets ? `${totals.protein}/${targets.protein}g` : `${totals.protein}g`} color={colors.info} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick add</Text>
        <View style={styles.templateGrid}>
          {MEAL_TEMPLATES.map((meal) => (
            <Pressable
              key={meal.name}
              accessibilityRole="button"
              onPress={async () => {
                await addQuickMeal(meal);
                load();
              }}
              style={styles.templateCard}
            >
              <Text style={styles.templateName}>{meal.name}</Text>
              <Text style={styles.templateMeta}>{meal.calories} kcal | {meal.protein}g protein</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Custom meal</Text>
        <View style={styles.segmentedControl}>
          {MEAL_TYPES.map((item) => (
            <Pressable key={item} accessibilityRole="button" onPress={() => setType(item)} style={[styles.segment, type === item && styles.segmentActive]}>
              <Text style={[styles.segmentText, type === item && styles.segmentTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Field label="Meal" placeholder="Chicken plate" value={name} onChangeText={setName} />
        <View style={styles.inputRow}>
          <Field label="Calories" placeholder="520" value={calories} onChangeText={setCalories} keyboardType="decimal-pad" />
          <Field label="Protein" placeholder="35g" value={protein} onChangeText={setProtein} keyboardType="decimal-pad" />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable accessibilityRole="button" onPress={handleAdd} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={20} color={colors.text} />
          <Text style={styles.addButtonText}>Add meal</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today</Text>
        {meals.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="fast-food-outline" size={24} color={colors.subtle} />
            <Text style={styles.emptyText}>No meals logged yet.</Text>
          </View>
        ) : (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealRow}>
              <View style={styles.mealText}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealMeta}>{meal.type} | {meal.calories} kcal | {meal.protein}g protein</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                hitSlop={12}
                onPress={async () => {
                  await deleteMeal(meal.id);
                  load();
                }}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={18} color={colors.primary} />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function Field({ label, placeholder, value, onChangeText, keyboardType = 'default' }: { label: string; placeholder: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'decimal-pad' }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput placeholder={placeholder} placeholderTextColor={colors.subtle} value={value} onChangeText={onChangeText} keyboardType={keyboardType} style={styles.input} />
    </View>
  );
}

function Macro({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.macroCard}>
      <Text style={[styles.macroValue, { color }]}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36, gap: 16 },
  hero: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 14 },
  heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.warning, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  macroCard: { flex: 1, backgroundColor: colors.input, borderRadius: 12, padding: 12 },
  macroValue: { fontSize: 17, fontWeight: '800' },
  macroLabel: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  templateGrid: { gap: 10 },
  templateCard: { backgroundColor: colors.input, borderRadius: 12, padding: 13, borderWidth: 1, borderColor: colors.border },
  templateName: { color: colors.text, fontSize: 15, fontWeight: '800' },
  templateMeta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  segmentedControl: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segment: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: colors.input, borderWidth: 1, borderColor: colors.border },
  segmentActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { color: colors.muted, fontSize: 12, fontWeight: '800', textTransform: 'capitalize' },
  segmentTextActive: { color: colors.text },
  inputRow: { flexDirection: 'row', gap: 10 },
  fieldWrap: { flex: 1, gap: 6 },
  fieldLabel: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  input: { backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border, color: colors.text, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
  errorText: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  addButton: { backgroundColor: colors.primary, borderRadius: 12, minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addButtonText: { color: colors.text, fontSize: 15, fontWeight: '800' },
  emptyBox: { minHeight: 92, borderRadius: 12, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.input, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
  mealText: { flex: 1 },
  mealName: { color: colors.text, fontSize: 15, fontWeight: '800' },
  mealMeta: { color: colors.muted, fontSize: 12, marginTop: 4, textTransform: 'capitalize' },
  deleteButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
});
