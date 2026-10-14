// src/utils/validation.js
import { COURSES } from '../data/menuData';

// Returns an object of error messages. Empty object = everything is valid.
export function validateDish({ name, description, course, price }) {
  const errors = {};

  const cleanName = String(name ?? '').trim();
  if (!cleanName) {
    errors.name = 'Enter a dish name';
  } else if (cleanName.length < 3) {
    errors.name = 'Dish name must be at least 3 characters';
  }

  const cleanDescription = String(description ?? '').trim();
  if (!cleanDescription) {
    errors.description = 'Enter a short description';
  } else if (cleanDescription.length > 150) {
    errors.description = 'Keep the description under 150 characters';
  }

  if (!COURSES.includes(course)) {
    errors.course = 'Pick a course';
  }

  const cleanPrice = String(price ?? '').trim().replace(',', '.');
  if (!cleanPrice) {
    errors.price = 'Enter a price';
  } else if (Number.isNaN(Number(cleanPrice))) {
    errors.price = 'Price must be a number';
  } else if (Number(cleanPrice) <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  return errors;
}
