import { useState } from 'react';
import { View, Text, Pressable, SectionList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COURSES } from '../src/data/menuData';
import { useMenu } from '../src/context/MenuContext';
import GradientBackground from '../src/components/GradientBackground';
import { colors, fonts } from '../src/theme';
 
const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);
 
export default function MenuScreen() {
  const router = useRouter();
  const { menu, removeDish, restoreDish } = useMenu();
  const [lastRemoved, setLastRemoved] = useState(null);
 
  // Group dishes by course, in the order starter, main, dessert
  const sections = COURSES.map((course) => ({
    title: titleCase(course),
    data: menu.filter((item) => item.course === course),
  })).filter((section) => section.data.length > 0);
 
  const handleRemove = (id) => {
    const removed = removeDish(id);
    setLastRemoved(removed);
  };
 
  const handleUndo = () => {
    if (lastRemoved) {
      restoreDish(lastRemoved);
      setLastRemoved(null);
    }
  };
 
  if (menu.length === 0) {
    return (
      <GradientBackground>
        <View style={styles.empty}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Start your menu</Text>
            <Text style={styles.emptyBody}>You haven't added any dishes yet.</Text>
            {lastRemoved && (
              <Pressable onPress={handleUndo}>
                <Text style={styles.undo}>Undo remove</Text>
              </Pressable>
            )}
            <Pressable style={styles.btn} onPress={() => router.back()}>
              <Text style={styles.btnText}>Add a dish</Text>
            </Pressable>
          </View>
        </View>
      </GradientBackground>
    );
  }
 
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.count}>
          {menu.length} {menu.length === 1 ? 'dish' : 'dishes'}
        </Text>
 
        {lastRemoved && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{lastRemoved.name} removed</Text>
            <Pressable onPress={handleUndo}>
              <Text style={styles.undo}>Undo</Text>
            </Pressable>
          </View>
        )}
 
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.section}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.price}>R{item.price}</Text>
                <Pressable
                  onPress={() =>
                    router.push({ pathname: '/', params: { editId: item.id } })
                  }
                >
                  <Text style={styles.edit}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => handleRemove(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
 
        <Pressable style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Add a dish</Text>
        </Pressable>
      </View>
    </GradientBackground>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  count: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.green,
    backgroundColor: colors.cream,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  section: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.green,
    backgroundColor: colors.cream,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 14,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  rowText: { flex: 1 },
  rowRight: { alignItems: 'flex-end', gap: 6 },
  name: { fontFamily: fonts.heading, fontSize: 15, color: colors.ink },
  desc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },
  price: { fontFamily: fonts.heading, fontSize: 15, color: colors.green },
  edit: { fontFamily: fonts.body, color: colors.green, fontSize: 12 },
  remove: { fontFamily: fonts.body, color: colors.red, fontSize: 12 },
  toast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  toastText: { fontFamily: fonts.body, color: colors.green },
  undo: { fontFamily: fonts.heading, color: colors.green },
  btn: {
    marginTop: 10,
    backgroundColor: colors.green,
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { fontFamily: fonts.heading, color: colors.cream },
  empty: { flex: 1, justifyContent: 'center', padding: 24 },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.green },
  emptyBody: { fontFamily: fonts.body, color: colors.muted, marginBottom: 8 },
});
 