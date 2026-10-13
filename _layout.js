import { Stack } from 'expo-router';
import { useFonts, Questrial_400Regular } from '@expo-google-fonts/questrial';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { MenuProvider } from '../src/context/MenuContext';
import { colors, fonts } from '../src/theme';
 
export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Questrial_400Regular, Poppins_600SemiBold });
 
  // Wait for the fonts before showing anything
  if (!fontsLoaded) return null;
 
  return (
    <MenuProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.green },
          headerTintColor: colors.cream,
          headerTitleStyle: { fontFamily: fonts.heading },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Ciao Lekker' }} />
        <Stack.Screen name="menu" options={{ title: 'Menu' }} />
      </Stack>
    </MenuProvider>
  );
}
 