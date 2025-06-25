// Endereço: apps/frontend/src/contexts/AuthProvider.tsx (versão com redirecionamento por papel)
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
    const token = Cookies.get('zello.token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          Cookies.remove('zello.token');
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

      Cookies.set('zello.token', access_token, { expires: 7, path: '/' });
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const profileResponse = await api.get('/auth/profile');
      const loggedUser = profileResponse.data;
      setUser(loggedUser);

      // ==========================================================
      // AQUI ESTÁ A NOVA LÓGICA DE REDIRECIONAMENTO INTELIGENTE
      // ==========================================================
      if (loggedUser.role === 'DOCTOR') {
        router.push('/dashboard');
      } else if (loggedUser.role === 'PATIENT') {
        router.push('/paciente/dashboard');
      } else {
        // Um fallback, caso o 'role' não seja nenhum dos esperados
        router.push('/');
      }

    } catch (error) {
      // O 'throw' garante que a página de login possa pegar o erro e mostrar a mensagem
      throw error;
    }
  }

  function signOut() {
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