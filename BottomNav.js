// src/components/BottomNav.js
// The same two-tab bar at the bottom of every screen: Add dish | Menu.
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

function Tab({ label, active, onPress }) {
  return (
    <Pressable
      onPress={active ? undefined : onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={styles.tab}
    >
      <View style={[styles.bar, active && styles.barOn]} />
      <Text style={[styles.label, active && styles.labelOn]}>{label}</Text>
    </Pressable>
  );
}

// active: 'add' or 'menu'. The optional onPress props let a screen
// override where a tab goes (for example, Edit goes back to the menu).
export default function BottomNav({ active, onPressAdd, onPressMenu }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goAdd = onPressAdd || (() => router.replace('/'));
  const goMenu = onPressMenu || (() => router.replace('/menu'));

  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <Tab label="Add dish" active={active === 'add'} onPress={goAdd} />
      <Tab label="Menu" active={active === 'menu'} onPress={goMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingBottom: 6 },
  bar: {
    height: 3,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  barOn: { backgroundColor: colors.gold },
  label: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  labelOn: { fontFamily: fonts.heading, color: colors.green },
});
