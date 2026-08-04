import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { Phone, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (phone: Phone, quantity?: number) => void;
  removeItem: (phoneId: string) => void;
  updateQuantity: (phoneId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((phone: Phone, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.phone.id === phone.id);
      if (existing) {
        return current.map((i) =>
          i.phone.id === phone.id ? { ...i, quantity: Math.min(i.quantity + quantity, phone.stock) } : i
        );
      }
      return [...current, { phone, quantity: Math.min(quantity, phone.stock) }];
    });
  }, []);

  const removeItem = useCallback((phoneId: string) => {
    setItems((current) => current.filter((i) => i.phone.id !== phoneId));
  }, []);

  const updateQuantity = useCallback((phoneId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(phoneId);
      return;
    }
    setItems((current) =>
      current.map((i) =>
        i.phone.id === phoneId ? { ...i, quantity: Math.min(quantity, i.phone.stock) } : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.phone.price * i.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
