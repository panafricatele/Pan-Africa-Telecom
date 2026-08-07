import { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef, ReactNode } from 'react';
import { Phone, CartItem } from '../types';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import { phonesApi } from '../lib/api';

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
  const { user } = useAuth();
  const phonesCache = useRef<Phone[]>([]);
  const syncing = useRef(false);

  // Load cart from Supabase when user signs in
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        if (phonesCache.current.length === 0) {
          phonesCache.current = await phonesApi.list();
        }

        const { data } = await supabase
          .from('cart_items')
          .select('phone_id, quantity')
          .eq('user_id', user.id);

        if (data && data.length > 0) {
          const loaded: CartItem[] = [];
          for (const row of data) {
            const phone = phonesCache.current.find((p) => p.id === row.phone_id);
            if (phone) loaded.push({ phone, quantity: row.quantity });
          }
          setItems((current) => {
            // Merge: keep local items not in remote, add remote items
            const merged = [...loaded];
            for (const local of current) {
              if (!merged.find((m) => m.phone.id === local.phone.id)) {
                merged.push(local);
              }
            }
            return merged;
          });
        }
      } catch {
        // Supabase cart load failed silently – local cart still works
      }
    })();
  }, [user]);

  // Sync cart to Supabase when items change (debounced)
  useEffect(() => {
    if (!user || syncing.current) return;
    const timeout = setTimeout(async () => {
      syncing.current = true;
      try {
        // Delete all then re-insert (simple upsert strategy)
        await supabase.from('cart_items').delete().eq('user_id', user.id);
        if (items.length > 0) {
          await supabase.from('cart_items').insert(
            items.map((i) => ({
              user_id: user.id,
              phone_id: i.phone.id,
              quantity: i.quantity,
            }))
          );
        }
      } catch {
        // Sync failed silently
      } finally {
        syncing.current = false;
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [items, user]);

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
