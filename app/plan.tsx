import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '../constants/theme';
import { getCurrentAccount } from '../lib/accounts';
import { toDateKey } from '../lib/date';
import { getProfile } from '../lib/profile';
import { getProgress, toggleExercise } from '../lib/tracking';
import { generatePlan } from '../lib/workoutEngine';
import { CompletedDay, Day, WeeklyPlan } from '../types/workout';

const colors = AppTheme.colors;

export default function Plan() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [progress, setProgress] = useState<CompletedDay[]>([]);
  const today = toDateKey();

  const load = useCallback(async () => {
    const account = await getCurrentAccount();

    if (!account) {
      router.replace('/account');
      return;
    }

    const profile = await getProfile();

    if (!profile) {
      router.replace('/onboarding');
      return;
    }

    const [savedProgress] = await Promise.all([getProgress()]);
    setPlan(generatePlan(parseFloat(profile.bmi), profile.goal));
    setProgress(savedProgress);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const completedByDay = useMemo(() => {
    return progress.reduce<Record<string, CompletedDay>>((acc, item) => {
      if (item.date === today) acc[item.day] = item;
      return acc;
    }, {});
  }, [progress, today]);

  const handleToggle = async (day: Day, exerciseName: string) => {
    await toggleExercise(
      today,
      day.day,
      day.focus,
      exerciseName,
      day.exercises.map((exercise) => exercise.name)
    );
    setProgress(await getProgress());
  };

  if (!plan) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Loading your plan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroIcon}>
            <Ionicons name="barbell-outline" size={24} color={colors.text} />
          </View>
          <Text style={styles.levelBadge}>{plan.level}</Text>
        </View>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.subtitle}>{plan.summary}</Text>
        <View style={styles.heroStats}>
          <Stat label="Days" value={`${plan.daysPerWeek}/week`} />
          <Stat label="Today" value={today} />
        </View>
      </View>

      {plan.schedule.map((day) => {
        const entry = completedByDay[day.day];
        const doneCount = entry?.exercises.filter((exercise) => exercise.done).length ?? 0;
        const complete = Boolean(entry?.completed);
        const percent = Math.round((doneCount / day.exercises.length) * 100);

        return (
          <View key={day.day} style={[styles.dayCard, complete && styles.dayCardComplete]}>
            <View style={styles.dayHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dayLabel}>{day.day}</Text>
                <Text style={styles.dayFocus}>{day.focus}</Text>
              </View>
              <View style={styles.dayMeta}>
                <Ionicons name={complete ? 'checkmark-circle' : 'time-outline'} size={18} color={complete ? colors.success : colors.muted} />
                <Text style={[styles.dayMetaText, complete && { color: colors.success }]}>{doneCount}/{day.exercises.length}</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: complete ? colors.success : colors.primary }]} />
            </View>

            {day.exercises.map((exercise) => {
              const done = Boolean(entry?.exercises.find((item) => item.name === exercise.name)?.done);
              return (
                <Pressable key={exercise.name} accessibilityRole="button" onPress={() => handleToggle(day, exercise.name)} style={[styles.exerciseRow, done && styles.exerciseRowDone]}>
                  <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={done ? colors.success : colors.subtle} />
                  <View style={styles.exerciseText}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseMeta}>{exercise.sets} sets x {exercise.reps} | {exercise.restSeconds}s rest</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36, gap: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  hero: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 12 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  levelBadge: { color: colors.text, backgroundColor: colors.surfaceRaised, borderRadius: 8, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, fontWeight: '800' },
  title: { color: colors.text, fontSize: 28, lineHeight: 34, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  heroStats: { flexDirection: 'row', gap: 10 },
  statPill: { flex: 1, backgroundColor: colors.input, borderRadius: 12, padding: 12 },
  statLabel: { color: colors.muted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { color: colors.text, fontSize: 14, fontWeight: '800', marginTop: 4 },
  dayCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  dayCardComplete: { borderColor: `${colors.success}88` },
  dayHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  dayLabel: { color: colors.muted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  dayFocus: { color: colors.text, fontSize: 19, fontWeight: '800', marginTop: 2 },
  dayMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.input, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  dayMetaText: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: colors.input, borderWidth: 1, borderColor: colors.border },
  exerciseRowDone: { borderColor: `${colors.success}66`, backgroundColor: '#102016' },
  exerciseText: { flex: 1 },
  exerciseName: { color: colors.text, fontSize: 15, fontWeight: '800' },
  exerciseMeta: { color: colors.muted, fontSize: 12, marginTop: 3 },
});




