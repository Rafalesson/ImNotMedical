// Endereço: apps/frontend/src/contexts/AuthProvider.tsx (versão refatorada)
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

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
  loading: boolean; // 1. EXPOR O ESTADO DE LOADING É UMA BOA PRÁTICA
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // O router ainda pode ser útil para outras coisas, como o signOut

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('zello.token');

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('zello.token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // 2. FUNÇÃO SIGNIN MODIFICADA
  async function signIn({ email, password }: any) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { access_token } = data;

      localStorage.setItem('zello.token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const profileResponse = await api.get('/auth/profile');
      setUser(profileResponse.data);

      // REMOVEMOS o router.push daqui. A página de login agora é responsável por isso.

    } catch (error) {
      // 3. A MUDANÇA PRINCIPAL: REMOVEMOS O ALERT E APENAS RE-LANÇAMOS O ERRO
      // Isso permite que o 'try...catch' da página de login funcione como planejado.
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('zello.token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    // Opcional: redirecionar para o login ao deslogar
    router.push('/'); 
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