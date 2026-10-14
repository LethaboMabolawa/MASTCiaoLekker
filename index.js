// app/index.js  (the chef adds and edits dishes here)
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COURSES } from '../src/data/menuData';
import { useMenu } from '../src/context/MenuContext';
import { validateDish, LIMITS } from '../src/utils/validation';
import GradientBackground from '../src/components/GradientBackground';
import ScreenHeader from '../src/components/ScreenHeader';
import Banner from '../src/components/Banner';
import Button from '../src/components/Button';
import BottomNav from '../src/components/BottomNav';
import { colors, fonts, spacing, radius, cardShadow } from '../src/theme';

const emptyForm = { name: '', description: '', course: '', price: '' };

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { menu, addDish, updateDish } = useMenu();
  const { editId } = useLocalSearchParams();
  const editing = menu.find((item) => item.id === editId);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // When opened from the menu's Edit link, fill the form with that dish
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description,
        course: editing.course,
        price: String(editing.price),
      });
      setErrors({});
      setMessage('');
    }
  }, [editId]);

  // The confirmation message disappears by itself after 5 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: true });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error for a field as soon as the chef edits it
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setMessage('');
  };

  // Check a single field when the chef leaves it, so mistakes show straight away
  const handleBlur = (field) => {
    const found = validateDish(form, menu, editing?.id);
    // Don't nag about empty fields the chef hasn't filled in yet
    if (!String(form[field] ?? '').trim()) return;
    setErrors((prev) => ({ ...prev, [field]: found[field] }));
  };

  // Only allow digits, one decimal point or comma in the price box
  const handlePriceChange = (text) => {
    update('price', text.replace(/[^0-9.,]/g, ''));
  };

  const handleSave = () => {
    const found = validateDish(form, menu, editing?.id);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setMessage('');
      scrollToTop(); // so the chef sees the error banner
      return;
    }

    const dish = {
      name: form.name.trim(),
      description: form.description.trim(),
      course: form.course,
      price: Number(String(form.price).replace(',', '.')),
    };

    if (editing) {
      updateDish(editing.id, dish);
      setMessage(`"${dish.name}" was updated`);
    } else {
      addDish(dish);
      setForm(emptyForm);
      setMessage(`"${dish.name}" was added to the menu`);
    }
    scrollToTop(); // so the chef sees the confirmation
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const descLength = form.description.length;

  return (
    <GradientBackground>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title={editing ? 'Edit dish' : 'Add a dish'}
          subtitle="South African inspired Italian"
        />

        <View style={styles.card}>
          {errorCount > 0 && (
            <Banner type="error">
              {errorCount} {errorCount === 1 ? 'thing needs' : 'things need'}{' '}
              fixing before this dish can be saved
            </Banner>
          )}
          {message !== '' && <Banner type="success">{message}</Banner>}

          <Text style={styles.label}>Dish name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={form.name}
            onChangeText={(t) => update('name', t)}
            onBlur={() => handleBlur('name')}
            placeholder="Boerewors ragù pappardelle"
            placeholderTextColor={colors.muted}
            maxLength={LIMITS.nameMax + 10}
            accessibilityLabel="Dish name"
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.multiline,
              errors.description && styles.inputError,
            ]}
            value={form.description}
            onChangeText={(t) => update('description', t)}
            onBlur={() => handleBlur('description')}
            placeholder="Slow-cooked boerewors and tomato sauce on wide ribbon pasta"
            placeholderTextColor={colors.muted}
            multiline
            accessibilityLabel="Dish description"
          />
          <Text
            style={[
              styles.counter,
              descLength > LIMITS.descriptionMax && { color: colors.red },
            ]}
          >
            {descLength}/{LIMITS.descriptionMax}
          </Text>
          {errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}

          <Text style={styles.label}>Course</Text>
          <View style={styles.chips}>
            {COURSES.map((c) => (
              <Pressable
                key={c}
                onPress={() => update('course', c)}
                accessibilityRole="button"
                accessibilityState={{ selected: form.course === c }}
                style={[styles.chip, form.course === c && styles.chipOn]}
              >
                <Text
                  style={[styles.chipText, form.course === c && styles.chipTextOn]}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
          {errors.course && <Text style={styles.error}>{errors.course}</Text>}

          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={form.price}
            onChangeText={handlePriceChange}
            onBlur={() => handleBlur('price')}
            placeholder="150"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            accessibilityLabel="Price in rands"
          />
          {errors.price && <Text style={styles.error}>{errors.price}</Text>}

          <View style={styles.buttons}>
            <Button
              label={editing ? 'Save changes' : 'Save dish'}
              onPress={handleSave}
            />
            {editing && (
              <Button
                label="Cancel"
                variant="secondary"
                onPress={() => router.back()}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <BottomNav
        active="add"
        onPressMenu={editing ? () => router.back() : undefined}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: spacing.screen, paddingBottom: 30 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.gap,
    marginBottom: 4,
  },
  input: {
    fontFamily: fonts.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    padding: 10,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: '#FFFDF8',
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  inputError: { borderColor: colors.red },
  counter: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'right',
    marginTop: 2,
  },
  error: {
    fontFamily: fonts.body,
    color: colors.red,
    fontSize: 12,
    marginTop: 4,
  },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { fontFamily: fonts.body, color: colors.muted },
  chipTextOn: { color: colors.green },
  buttons: { marginTop: 20, gap: 10 },
});
