import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

export function ThemeToggle() {
  const colorScheme = useColorScheme();
  // Add safety check
  if (!colorScheme) {
    return null;
  }

  const { theme, toggleTheme } = colorScheme;
  const iconColor = useThemeColor({}, 'icon');

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.button}>
      <Ionicons
        name={theme === 'dark' ? 'sunny' : 'moon'}
        size={26}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});