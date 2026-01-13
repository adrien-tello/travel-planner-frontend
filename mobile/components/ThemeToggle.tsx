import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Sun } from 'react-native-feather';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius, typography } from '../theme/colors';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {theme === 'light' ? (
            <Sun width={20} height={20} color={colors.primary} />
          ) : (
            <Moon width={20} height={20} color={colors.primary} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
  },
});