// src/components/GradientBackground.js
import { LinearGradient } from 'expo-linear-gradient';
import { gradientColors, gradientLocations } from '../theme';

export default function GradientBackground({ children }) {
  return (
    <LinearGradient
      colors={gradientColors}
      locations={gradientLocations}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
