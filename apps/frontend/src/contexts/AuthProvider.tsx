// Endereço: apps/frontend/src/contexts/AuthProvider.tsx (Com Logs para Depuração)
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// As interfaces que definimos anteriormente (estão corretas)
interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface DoctorProfile {
  name: string;
  crm: string;
  specialty?: string;
  phone?: string;
  address?: Address;
}

interface PatientProfile {
  name: string;
  cpf: string;
  dateOfBirth: string;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address?: Address;
}

interface User {
  id: string;
  email: string;
  role: 'DOCTOR' | 'PATIENT';
  doctorProfile?: DoctorProfile;
  patientProfile?: PatientProfile;
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
          // LOG DE DEPURAÇÃO 1: O que recebemos ao recarregar a página
          console.log('[AuthProvider - useEffect] Perfil recebido do backend:', response.data);
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
      
      // LOG DE DEPURAÇÃO 2: O que recebemos logo após o login
      console.log('[AuthProvider - signIn] Perfil recebido do backend:', profileResponse.data);
      
      const loggedUser = profileResponse.data;
      setUser(loggedUser);

      if (loggedUser.role === 'DOCTOR') {
        router.push('/dashboard');
      } else if (loggedUser.role === 'PATIENT') {
        router.push('/paciente/dashboard');
      } else {
        router.push('/');
      }

    } catch (error) {
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

export const useAuth = () => {
  return useContext(AuthContext);
};