import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
// import { useTheme } from '../contexts/ThemeContext';

export function EmptyState() {
//   const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name="checkbox-outline" size={64}  />
      <ThemedText style={[styles.title]}>No todos yet</ThemedText>
      <ThemedText style={[styles.subtitle]}>
        Tap the + button to create your first todo
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});