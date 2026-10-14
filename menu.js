// app/menu.js  (the chef searches, views, edits and removes dishes here)
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SectionList,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COURSES } from '../src/data/menuData';
import { useMenu } from '../src/context/MenuContext';
import GradientBackground from '../src/components/GradientBackground';
import ScreenHeader from '../src/components/ScreenHeader';
import Button from '../src/components/Button';
import BottomNav from '../src/components/BottomNav';
import { colors, fonts, spacing, radius, cardShadow } from '../src/theme';

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function MenuScreen() {
  const router = useRouter();
  const { menu, removeDish, restoreDish } = useMenu();
  const [lastRemoved, setLastRemoved] = useState(null);
  const [query, setQuery] = useState('');

  // The "removed" message disappears by itself after 8 seconds
  useEffect(() => {
    if (!lastRemoved) return;
    const timer = setTimeout(() => setLastRemoved(null), 8000);
    return () => clearTimeout(timer);
  }, [lastRemoved]);

  // Search by dish name, description or course
  const cleanQuery = query.trim().toLowerCase();
  const searching = cleanQuery.length > 0;
  const visible = searching
    ? menu.filter((item) =>
        `${item.name} ${item.description} ${item.course}`
          .toLowerCase()
          .includes(cleanQuery)
      )
    : menu;

  // Group dishes by course, in the order starter, main, dessert
  const sections = COURSES.map((course) => ({
    title: titleCase(course),
    data: visible.filter((item) => item.course === course),
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

  const subtitle = `${menu.length} ${menu.length === 1 ? 'dish' : 'dishes'} on the menu`;

  const removedBanner = lastRemoved && (
    <View style={styles.removedBox} accessibilityRole="alert">
      <Text style={styles.removedText}>
        Done: "{lastRemoved.name}" was removed from the menu
      </Text>
      <Pressable
        onPress={handleUndo}
        accessibilityRole="button"
        accessibilityLabel="Undo remove"
        hitSlop={8}
      >
        <Text style={styles.undo}>Undo</Text>
      </Pressable>
    </View>
  );

  // Nothing on the menu at all
  if (menu.length === 0) {
    return (
      <GradientBackground>
        <View style={styles.body}>
          <ScreenHeader title="Our menu" subtitle={subtitle} />
          <View style={styles.card}>
            {removedBanner}
            <Text style={styles.emptyTitle}>Start your menu</Text>
            <Text style={styles.emptyBody}>You haven't added any dishes yet.</Text>
            <Button label="Add a dish" onPress={() => router.replace('/')} />
          </View>
        </View>
        <BottomNav active="menu" />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.body}>
        <ScreenHeader title="Our menu" subtitle={subtitle} />

        {removedBanner}

        {/* Search box */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search dishes, e.g. biltong or dessert"
            placeholderTextColor={colors.muted}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search the menu"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={10}
            >
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          )}
        </View>

        {searching && visible.length > 0 && (
          <Text style={styles.pill}>
            {visible.length} of {menu.length} dishes match "{query.trim()}"
          </Text>
        )}
      </View>

      {/* No results */}
      {searching && visible.length === 0 ? (
        <View style={styles.noResults}>
          <View style={styles.card}>
            <Text style={styles.emptyTitle}>No dishes found</Text>
            <Text style={styles.emptyBody}>
              Nothing on the menu matches "{query.trim()}". Check the spelling or
              try a shorter word.
            </Text>
            <Button label="Clear search" onPress={() => setQuery('')} />
          </View>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }) => (
            <Text style={styles.section}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.desc} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.price}>R{item.price}</Text>
                <View style={styles.actions}>
                  <Pressable
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${item.name}`}
                    onPress={() =>
                      router.push({ pathname: '/', params: { editId: item.id } })
                    }
                  >
                    <Text style={styles.edit}>Edit</Text>
                  </Pressable>
                  <Pressable
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${item.name}`}
                    onPress={() => handleRemove(item.id)}
                  >
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <BottomNav active="menu" />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.screen, paddingTop: spacing.screen },
  list: { flex: 1 },
  listContent: { paddingHorizontal: spacing.screen, paddingBottom: 16 },
  noResults: { flex: 1, paddingHorizontal: spacing.screen, paddingTop: 8 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.card,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },

  // Search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 4,
    ...cardShadow,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 10,
  },
  clear: { fontFamily: fonts.heading, fontSize: 13, color: colors.green },

  // Pills (course names and search result count)
  pill: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.cream,
    backgroundColor: colors.green,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
  },
  section: {
    fontFamily: fonts.heading,
    fontSize: 13,
    color: colors.cream,
    backgroundColor: colors.green,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 6,
  },

  // Compact dish rows
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 5,
    gap: 8,
  },
  rowText: { flex: 1 },
  rowRight: { alignItems: 'flex-end', gap: 2 },
  actions: { flexDirection: 'row', gap: 12 },
  name: { fontFamily: fonts.heading, fontSize: 14, color: colors.ink },
  desc: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
  },
  price: { fontFamily: fonts.heading, fontSize: 14, color: colors.green },
  edit: { fontFamily: fonts.body, color: colors.green, fontSize: 12 },
  remove: { fontFamily: fonts.body, color: colors.red, fontSize: 12 },

  // Removed message
  removedBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.successBg,
    padding: 12,
    borderRadius: radius.control,
    marginBottom: 8,
  },
  removedText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.green,
  },
  undo: { fontFamily: fonts.heading, color: colors.green, fontSize: 14 },

  // Empty states
  emptyTitle: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.green,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: fonts.body,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
});
