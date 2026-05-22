import { create } from 'zustand';
const useCartStore = create((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem('cart')) || [],
  addToCart: (product, qty = 1) => {
    const { cartItems } = get();
    const existing = cartItems.find((i) => i._id === product._id);
    let updated;
    if (existing) {
      updated = cartItems.map((i) =>
        i._id === product._id ? { ...i, qty: i.qty + qty } : i
      );
    } else {
      updated = [...cartItems, { ...product, qty }];
    }
    localStorage.setItem('cart', JSON.stringify(updated));
    set({ cartItems: updated });
  },
  removeFromCart: (id) => {
    const updated = get().cartItems.filter((i) => i._id !== id);
    localStorage.setItem('cart', JSON.stringify(updated));
    set({ cartItems: updated });
  },
  updateQty: (id, qty) => {
    const updated = get().cartItems.map((i) =>
      i._id === id ? { ...i, qty } : i
    );
    localStorage.setItem('cart', JSON.stringify(updated));
    set({ cartItems: updated });
  },
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ cartItems: [] });
  },
  getTotal: () => {
    return get().cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  },
  getCount: () => {
    return get().cartItems.reduce((a, i) => a + i.qty, 0);
  },
}));
export default useCartStore;