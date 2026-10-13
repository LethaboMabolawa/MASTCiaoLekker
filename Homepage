import { useState } from 'react';
import { initialMenu } from '../data/menuData';

const [menu, setMenu] = useState(initialMenu);
const addDish = (dish) => setMenu([...menu, { ...dish, id: Date.now().toString() }]);
const removeDish = (id) => setMenu(menu.filter((item) => item.id !== id));