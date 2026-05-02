import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable } from 'react-native';
import { injectSpeedInsights } from '@vercel/speed-insights';

import { AppTheme } from '../constants/theme';

const HeaderButton = ({ name, onPress }: { name: keyof typeof Ionicons.glyphMap; onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    hitSlop={12}
    onPress={onPress}
    style={{ padding: 6 }}
  >
    <Ionicons name={name} size={22} color={AppTheme.colors.text} />
  </Pressable>
);

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      injectSpeedInsights({ framework: 'react' });
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: AppTheme.colors.background },
        headerStyle: { backgroundColor: AppTheme.colors.background },
        headerTintColor: AppTheme.colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ title: 'Account', headerShown: false }} />
      <Stack.Screen name="home" options={{ title: 'Dashboard', headerShown: false }} />
      <Stack.Screen
        name="onboarding"
        options={{
          title: 'Profile',
          headerLeft: () => <HeaderButton name="people-outline" onPress={() => router.replace('/account')} />,
        }}
      />
      <Stack.Screen
        name="plan"
        options={{
          title: 'Workout Plan',
          headerLeft: () => <HeaderButton name="chevron-back" onPress={() => router.back()} />,
        }}
      />
      <Stack.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          headerLeft: () => <HeaderButton name="chevron-back" onPress={() => router.back()} />,
        }}
      />
      <Stack.Screen
        name="progress"
        options={{
          title: 'Progress',
          headerLeft: () => <HeaderButton name="chevron-back" onPress={() => router.back()} />,
        }}
      />
      <Stack.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          headerLeft: () => <HeaderButton name="chevron-back" onPress={() => router.back()} />,
        }}
      />
      <Stack.Screen name="explore" options={{ title: 'Explore' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Gym Tunisia' }} />
    </Stack>
  );
}
