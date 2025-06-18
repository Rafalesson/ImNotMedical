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
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const isAuthenticated = !!user;

  // ESTE useEffect VAI RODAR APENAS UMA VEZ, QUANDO O COMPONENTE "ACORDA" NO NAVEGADOR
  useEffect(() => {
    const token = localStorage.getItem('zello.token');

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // Se o token for inválido, limpa tudo
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

  async function signIn({ email, password }: any) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { access_token } = data;

      localStorage.setItem('zello.token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const profileResponse = await api.get('/auth/profile');
      setUser(profileResponse.data);

      router.push('/dashboard'); // <-- A LINHA MÁGICA DO REDIRECIONAMENTO

    } catch (error) {
      console.error("Falha no login:", error);
      alert('Email ou senha inválidos!'); // Uma forma simples de dar feedback
    }
  }

  function signOut() {
    localStorage.removeItem('zello.token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  // Se estiver carregando (verificando o token), não mostramos nada ainda
  if (loading) {
    return null; // Ou um componente de "Spinner/Loading..."
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}