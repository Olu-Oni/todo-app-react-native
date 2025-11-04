import { Colors } from '@/constants/theme';
import { useColorScheme } from './use-color-scheme';

export function useThemeGradient(
  gradientName: 'checkboxGradient'
): string[] {
  const { theme } = useColorScheme();
  return Colors[theme][gradientName];
}