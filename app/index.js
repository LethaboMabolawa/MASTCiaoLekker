import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import GradientBackground from '../src/components/GradientBackground';
import { useMenu } from '../src/context/MenuContext';
import { COURSES } from '../src/data/menuData';
import { colors, fonts } from '../src/theme';
import { validateDish } from '../src/utils/validation';
 
const emptyForm = { name: '', description: '', course: '', price: '' };
 
export default function HomeScreen() {
  const router = useRouter();
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
 
  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error for a field as soon as the chef edits it
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setMessage('');
  };
 
  const handleSave = () => {
    const found = validateDish(form);
    setErrors(found);
 
    if (Object.keys(found).length > 0) {
      setMessage('');
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
      setMessage(`${dish.name} updated`);
    } else {
      addDish(dish);
      setForm(emptyForm);
      setMessage(`${dish.name} added to the menu`);
    }
  };
 
  const errorCount = Object.values(errors).filter(Boolean).length;
 
  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{editing ? 'Edit dish' : 'Add a dish'}</Text>
        <Text style={styles.tagline}>South African inspired Italian</Text>
 
        <View style={styles.card}>
          {errorCount > 0 && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>
                Fix {errorCount} {errorCount === 1 ? 'thing' : 'things'} before saving
              </Text>
            </View>
          )}
          {message !== '' && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>{message}</Text>
            </View>
          )}
 
          <Text style={styles.label}>Dish name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={form.name}
            onChangeText={(t) => update('name', t)}
            placeholder="Boerewors ragù pappardelle"
            placeholderTextColor={colors.muted}
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
            placeholder="Slow-cooked boerewors and tomato sauce on wide ribbon pasta"
            placeholderTextColor={colors.muted}
            multiline
          />
          {errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}
 
          <Text style={styles.label}>Course</Text>
          <View style={styles.chips}>
            {COURSES.map((c) => (
              <Pressable
                key={c}
                onPress={() => update('course', c)}
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
            onChangeText={(t) => update('price', t)}
            placeholder="150"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={styles.error}>{errors.price}</Text>}
 
          <Pressable style={styles.primaryBtn} onPress={handleSave}>
            <Text style={styles.primaryBtnText}>
              {editing ? 'Save changes' : 'Save dish'}
            </Text>
          </Pressable>
 
          {editing ? (
            <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
              <Text style={styles.secondaryBtnText}>Back to menu</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.secondaryBtnText}>View menu ({menu.length})</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
 
const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  heading: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.cream,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.cream,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    fontFamily: fonts.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: '#FFFDF8',
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  inputError: { borderColor: colors.red },
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
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { fontFamily: fonts.body, color: colors.muted },
  chipTextOn: { color: colors.green },
  errorBanner: {
    backgroundColor: colors.errorBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  errorBannerText: { fontFamily: fonts.body, color: colors.red },
  successBanner: {
    backgroundColor: colors.successBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  successText: { fontFamily: fonts.body, color: colors.green },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: colors.gold,
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { fontFamily: fonts.heading, color: colors.green },
  secondaryBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: colors.green,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: { fontFamily: fonts.heading, color: colors.green },
});
 