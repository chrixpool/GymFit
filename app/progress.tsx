import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '../constants/theme';
import { getProgress, getStreak, getWeeklyProgress } from '../lib/tracking';
import { CompletedDay, WeeklyProgress } from '../types/workout';

const colors = AppTheme.colors;

export default function Progress() {
  const [progress, setProgress] = useState<CompletedDay[]>([]);
  const [weekly, setWeekly] = useState<WeeklyProgress | null>(null);
  const [streak, setStreak] = useState(0);

  const load = useCallback(async () => {
    const [savedProgress, week, currentStreak] = await Promise.all([getProgress(), getWeeklyProgress(), getStreak()]);
    setProgress(savedProgress);
    setWeekly(week);
    setStreak(currentStreak);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const completedSessions = progress.filter((item) => item.completed).length;
  const totalExercises = progress.reduce((sum, day) => sum + day.exercises.length, 0);
  const doneExercises = progress.reduce((sum, day) => sum + day.exercises.filter((exercise) => exercise.done).length, 0);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="analytics-outline" size={24} color={colors.text} />
        </View>
        <Text style={styles.title}>Progress dashboard</Text>
        <Text style={styles.subtitle}>A clean read on consistency, completed sessions, and exercise volume.</Text>
        <View style={styles.metricRow}>
          <Metric label="Week" value={`${weekly?.completed ?? 0}/${weekly?.total ?? 7}`} color={colors.success} />
          <Metric label="Streak" value={`${streak}`} color={colors.primary} />
          <Metric label="Exercises" value={`${doneExercises}/${totalExercises}`} color={colors.info} />
        </View>
      </View>

      {progress.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="barbell-outline" size={30} color={colors.subtle} />
          <Text style={styles.emptyTitle}>No workouts tracked yet</Text>
          <Text style={styles.emptyCopy}>Start a workout and tap exercises as you complete them.</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push('/plan')} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Open plan</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Workout history</Text>
            <Text style={styles.badge}>{completedSessions} complete</Text>
          </View>
          {progress.map((day) => {
            const doneCount = day.exercises.filter((exercise) => exercise.done).length;
            const percent = day.exercises.length ? Math.round((doneCount / day.exercises.length) * 100) : 0;

            return (
              <View key={`${day.date}-${day.day}`} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyDate}>{day.date}</Text>
                    <Text style={styles.historyTitle}>{day.day} | {day.focus}</Text>
                  </View>
                  <Ionicons name={day.completed ? 'checkmark-circle' : 'time-outline'} size={22} color={day.completed ? colors.success : colors.warning} />
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: day.completed ? colors.success : colors.warning }]} />
                </View>
                <View style={styles.exerciseList}>
                  {day.exercises.map((exercise) => (
                    <View key={exercise.name} style={styles.exerciseItem}>
                      <Ionicons name={exercise.done ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={exercise.done ? colors.success : colors.subtle} />
                      <Text style={styles.exerciseText}>{exercise.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36, gap: 16 },
  hero: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 14 },
  heroIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.info, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  metricRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, backgroundColor: colors.input, borderRadius: 12, padding: 12 },
  metricValue: { fontSize: 19, fontWeight: '800' },
  metricLabel: { color: colors.muted, fontSize: 11, fontWeight: '800', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  emptyCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 22, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 10 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  emptyCopy: { color: colors.muted, textAlign: 'center', lineHeight: 20 },
  emptyButton: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12, marginTop: 4 },
  emptyButtonText: { color: colors.text, fontWeight: '800' },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  badge: { color: colors.text, backgroundColor: colors.surfaceRaised, borderRadius: 8, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, fontWeight: '800' },
  historyCard: { backgroundColor: colors.input, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 12 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyDate: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  historyTitle: { color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 3 },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  exerciseList: { gap: 8 },
  exerciseItem: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  exerciseText: { color: colors.muted, fontSize: 13, flex: 1 },
});
