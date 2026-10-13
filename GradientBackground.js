import { LinearGradient } from 'expo-linear-gradient';
import { gradientColors } from '../theme';
 
export default function GradientBackground({ children }) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
 