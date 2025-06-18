// src/components/Sidebar.tsx
'use client';
import { LayoutDashboard, FileText, Calendar, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const { user, signOut } = useContext(AuthContext);
  const router = useRouter();

  function handleLogout() {
    signOut();
    router.push('/');
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-10">Zello</div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4">
            <a href="/dashboard" className="flex items-center p-2 rounded-lg bg-gray-700">
              <LayoutDashboard className="mr-3" /> Dashboard
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <FileText className="mr-3" /> Atestados
            </a>
          </li>
           <li className="mb-4">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <Calendar className="mr-3" /> Agenda
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="mb-4 p-2 border-t border-gray-700">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center w-full p-2 rounded-lg hover:bg-red-600">
          <LogOut className="mr-3" /> Sair
        </button>
      </div>
    </aside>
  );
}