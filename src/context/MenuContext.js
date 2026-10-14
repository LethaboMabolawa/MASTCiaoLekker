// src/context/MenuContext.js
import { createContext, useContext, useState } from 'react';
import { initialMenu } from '../data/menuData';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(initialMenu);

  const addDish = (dish) => {
    const newDish = { ...dish, id: Date.now().toString() };
    setMenu((prev) => [...prev, newDish]);
  };

  // Returns the removed dish so the screen can offer an undo.
  const removeDish = (id) => {
    const removed = menu.find((item) => item.id === id);
    setMenu((prev) => prev.filter((item) => item.id !== id));
    return removed;
  };

  const restoreDish = (dish) => {
    setMenu((prev) => [...prev, dish]);
  };

  // Update the fields of an existing dish, keeping its id.
  const updateDish = (id, changes) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  return (
    <MenuContext.Provider
      value={{ menu, addDish, removeDish, restoreDish, updateDish }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used inside a MenuProvider');
  }
  return context;
}
