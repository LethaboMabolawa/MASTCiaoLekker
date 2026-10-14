// src/data/menuData.js
// Sample menu for Ciao Lekker: South African inspired Italian food.
// Each item has: id, name, description, course, price (in rands).

export const COURSES = ['starter', 'main', 'dessert'];

export const initialMenu = [
  // Starters
  {
    id: '1',
    name: 'Biltong Bruschetta',
    description: 'Toasted ciabatta, whipped ricotta, shaved biltong and a drizzle of chutney.',
    course: 'starter',
    price: 75,
  },
  {
    id: '2',
    name: 'Boerewors Arancini',
    description: 'Crispy risotto balls stuffed with boerewors and mozzarella, served with a tomato-smoor dip.',
    course: 'starter',
    price: 85,
  },
  {
    id: '3',
    name: 'Peri-Peri Calamari Fritti',
    description: 'Lightly fried calamari with peri-peri aioli and lemon.',
    course: 'starter',
    price: 95,
  },
  {
    id: '4',
    name: 'Burrata and Roasted Butternut',
    description: 'Creamy burrata with roasted butternut, toasted pumpkin seeds and honey.',
    course: 'starter',
    price: 90,
  },

  // Mains
  {
    id: '5',
    name: 'Boerewors Ragù Pappardelle',
    description: 'Slow-cooked boerewors and tomato sauce on wide ribbon pasta.',
    course: 'main',
    price: 150,
  },
  {
    id: '6',
    name: 'Biltong Carbonara',
    description: 'Classic carbonara with crispy biltong instead of pancetta.',
    course: 'main',
    price: 145,
  },
  {
    id: '7',
    name: 'Cape Malay Chicken Risotto',
    description: 'Creamy risotto with mild masala-spiced chicken and apricot.',
    course: 'main',
    price: 155,
  },
  {
    id: '8',
    name: 'Karoo Lamb Gnocchi',
    description: 'Potato gnocchi in a rosemary and slow-braised Karoo lamb sauce.',
    course: 'main',
    price: 175,
  },
  {
    id: '9',
    name: 'Braai Pizza',
    description: 'Wood-fired base with boerewors, caramelised onion, mozzarella and chakalaka.',
    course: 'main',
    price: 140,
  },

  // Desserts
  {
    id: '10',
    name: 'Amarula Tiramisu',
    description: 'The Italian classic made with Amarula cream liqueur.',
    course: 'dessert',
    price: 80,
  },
  {
    id: '11',
    name: 'Rooibos Panna Cotta',
    description: 'Rooibos-infused panna cotta with honeyed fruit.',
    course: 'dessert',
    price: 70,
  },
  {
    id: '12',
    name: 'Malva Pudding Affogato',
    description: 'Warm malva pudding topped with vanilla gelato and a shot of espresso.',
    course: 'dessert',
    price: 85,
  },
  {
    id: '13',
    name: 'Koeksister Cannoli',
    description: 'Crisp cannoli shells with a syrupy, spiced ricotta filling.',
    course: 'dessert',
    price: 75,
  },
];
