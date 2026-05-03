import { Feather, Ionicons } from '@expo/vector-icons';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTheme } from '../constants/theme';
import { createLog, getCurrentLog, getLogs } from '../lib/logs';
import { getProfile } from '../lib/profile';
import { Log, Profile } from '../types/workout';
import SupportModal, { SupportButton } from '../components/SupportModal';

const colors = AppTheme.colors;
const windowWidth = Dimensions.get('window').width;

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentLog, setCurrentLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const load = useCallback(async () => {
    try {
      const loadedProfile = await getProfile();
      const loadedCurrentLog = await getCurrentLog();
      const loadedLogs = await getLogs();

      setProfile(loadedProfile);
      setCurrentLog(loadedCurrentLog);
      setLogs(loadedLogs);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleStartWorkout = async () => {
    if (!profile) {
      router.push('/onboarding');
      return;
    }

    try {
      if (currentLog) {
        Alert.alert('Already Active', 'You have an active workout. Complete it first or cancel it to start a new one.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Complete', onPress: () => router.push(`/log/${currentLog.id}`) },
          { text: 'Cancel Workout', onPress: () => router.push('/workout/cancel') },
        ]);
        return;
      }

      await createLog({ type: 'workout' });
      router.push('/workout');
    } catch (error) {
      console.error('Failed to start workout:', error);
    }
  };

  // Calculate streak status based on workout count
  const getStreakStatus = (count: number): { label: string; color: string } => {
    if (count >= 100) return { label: 'Legendary', color: colors.success };
    if (count >= 50) return { label: 'On Fire', color: '#FF6B35' };
    if (count >= 20) return { label: 'Consistent', color: '#F9C74F' };
    if (count >= 5) return { label: 'Building', color: '#90BE6D' };
    return { label: 'Getting Started', color: colors.muted };
  };

  const streakStatus = getStreakStatus(profile?.workoutsCompleted || 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.content} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Support Button */}
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>GymFit</Text>
          <SupportButton onPress={() => setShowSupportModal(true)} size="medium" />
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stats</Text>

          {/* XP/Tier Card */}
          <View style={styles.xpCard}>
            <View style={styles.xpHeader}>
              <View>
                <Text style={styles.xpValue}>{profile?.xp || 0} XP</Text>
                <Text style={styles.xpTier}>Tier {profile?.tier || 0}</Text>
              </View>
              <Feather name="zap" size={24} color={colors.warning} />
            </View>

            <View style={styles.xpProgress}>
              <View style={[styles.xpBar, { backgroundColor: colors.input }]}>
                <View style={[styles.xpFill, { backgroundColor: colors.warning, width: `${((profile?.xp || 0) % 100)}%` }]} />
              </View>
              <Text style={styles.xpProgressText}>
                {profile?.xp && profile?.tier ? `${100 - (profile.xp % 100)} XP to Tier ${(profile.tier || 0) + 1}` : '0 XP to Tier 1'}
              </Text>
            </View>
          </View>

          {/* Streak Status */}
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: streakStatus.color }]}>{profile?.workoutsCompleted || 0}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
              <Text style={[styles.streakLabel, { color: streakStatus.color }]}>{streakStatus.label}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.mealsLogged || 0}</Text>
              <Text style={styles.statLabel}>Meals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.waterIntake || 0}L</Text>
              <Text style={styles.statLabel}>Water</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <Pressable accessibilityRole="button" onPress={handleStartWorkout} style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="barbell-outline" size={24} color={colors.text} />
              </View>
              <Text style={styles.actionLabel}>{currentLog ? 'Continue Workout' : 'Start Workout'}</Text>
            </Pressable>

            <Link href="/meal-log" asChild>
              <Pressable accessibilityRole="button" style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name="nutrition-outline" size={24} color={colors.text} />
                </View>
                <Text style={styles.actionLabel}>Log Meal</Text>
              </Pressable>
            </Link>

            <Link href="/profile" asChild>
              <Pressable accessibilityRole="button" style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: colors.surfaceRaised }]}>
                  <Ionicons name="person-outline" size={24} color={colors.text} />
                </View>
                <Text style={styles.actionLabel}>Profile</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Recent Logs */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <Link href="/history" asChild>
              <Pressable accessibilityRole="button">
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </Link>
          </View>

          <FlatList
            data={logs.slice(0, 5)}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.logItem}>
                <View style={styles.logIcon}>
                  <Ionicons name={item.type === 'workout' ? 'barbell' : 'restaurant'} size={20} color={colors.text} />
                </View>
                <View style={styles.logContent}>
                  <Text style={styles.logTitle}>{item.type === 'workout' ? 'Workout' : 'Meal Log'}</Text>
                  <Text style={styles.logDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={24} color={colors.muted} />
                <Text style={styles.emptyStateText}>No activity yet</Text>
                <Text style={styles.emptyStateSubtext}>Start a workout or log a meal to see it here</Text>
              </View>
            }
          />
        </View>

        {/* Support Modal - Placed correctly inside ScrollView */}
        <SupportModal visible={showSupportModal} onClose={() => setShowSupportModal(false)} />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36, gap: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  pageTitle: { color: colors.text, fontSize: 28, fontWeight: '800' },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  viewAllText: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  xpCard: { backgroundColor: colors.surfaceRaised, borderRadius: 14, padding: 14, gap: 10 },
  xpHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  xpValue: { color: colors.text, fontSize: 24, fontWeight: '800' },
  xpTier: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  xpProgress: { gap: 6 },
  xpBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 4 },
  xpProgressText: { color: colors.muted, fontSize: 11, fontWeight: '800', textAlign: 'right' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.muted, fontSize: 12, fontWeight: '800', marginTop: 4 },
  streakLabel: { fontSize: 10, fontWeight: '800', marginTop: 2, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, alignItems: 'center', gap: 8 },
  actionIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: colors.text, fontSize: 12, fontWeight: '800' },
  logItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.input, borderRadius: 12 },
  logIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  logContent: { flex: 1 },
  logTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  logDate: { color: colors.muted, fontSize: 11, fontWeight: '800', marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyStateText: { color: colors.text, fontSize: 14, fontWeight: '800' },
  emptyStateSubtext: { color: colors.muted, fontSize: 12, textAlign: 'center' },
});
