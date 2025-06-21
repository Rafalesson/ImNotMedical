// Endereço: apps/frontend/src/contexts/AuthProvider.tsx (versão final com cookies)
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // 1. IMPORTAMOS A BIBLIOTECA DE COOKIES

interface User {
  userId: string;
  email: string;
  role: 'DOCTOR' | 'PATIENT';
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    // 2. LEMOS O TOKEN DOS COOKIES, NÃO MAIS DO LOCALSTORAGE
    const token = Cookies.get('zello.token');

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          Cookies.remove('zello.token'); // Limpa o cookie se for inválido
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  async function signIn({ email, password }: any) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { access_token } = data;

      // 3. SALVAMOS O TOKEN NOS COOKIES
      // O token irá expirar em 1 dia.
      Cookies.set('zello.token', access_token, { expires: 1, path: '/' }); 

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const profileResponse = await api.get('/auth/profile');
      setUser(profileResponse.data);

    } catch (error) {
      throw error;
    }
  }

  function signOut() {
    // 4. REMOVEMOS O TOKEN DOS COOKIES AO DESLOGAR
    Cookies.remove('zello.token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/login'); 
  }

  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}