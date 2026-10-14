// src/theme.js
// Ciao Lekker look: Italian green and gold, with Questrial and Poppins fonts.

export const colors = {
  green: '#0F5132',
  gold: '#F2B134',
  cream: '#FFF8EC',
  red: '#B3282D',
  ink: '#1F2A24',
  muted: '#5C6B63',
  border: '#E4DCCB',
  white: '#FFFFFF',
  errorBg: '#FBE9EA',
  successBg: '#E3F1E8',
};

export const fonts = {
  body: 'Questrial_400Regular',
  heading: 'Poppins_600SemiBold',
};

// Shared sizes so every screen uses the same spacing
export const spacing = {
  screen: 20, // padding around every screen
  card: 18, // padding inside white cards
  gap: 12, // space between items
};

export const radius = {
  card: 16,
  control: 10,
  pill: 18,
};

// Green at the top, fading through gold into white at the bottom
export const gradientColors = [colors.green, colors.gold, colors.white];
export const gradientLocations = [0, 0.4, 1];

// A soft shadow so white cards stand out against the white part of the gradient
export const cardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};
