import { create } from 'zustand';
import axios from '../api/axios';
const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  login: async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    set({ user: data });
    return data;
  },
  register: async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    localStorage.setItem('user', JSON.stringify(data));
    set({ user: data });
    return data;
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
}));
export default useAuthStore;