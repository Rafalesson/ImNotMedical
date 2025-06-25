// Endereço: apps/frontend/src/app/paciente/dashboard/page.tsx (versão com estilos corrigidos)
'use client';

import { AuthContext } from "@/contexts/AuthProvider";
import { Stethoscope, FileText, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

const serviceCards = [
  { name: "Agendar Consulta", href: "#", icon: CalendarDays, description: "Encontre médicos e agende sua teleconsulta." },
  { name: "Meus Atestados", href: "#", icon: FileText, description: "Acesse e baixe todos os seus atestados digitais." },
  { name: "Minhas Receitas", href: "#", icon: FileText, description: "Visualize e gerencie suas receitas médicas." },
  { name: "Encontrar Médicos", href: "#", icon: Stethoscope, description: "Busque por especialistas e veja seus perfis." }
];

export default function PatientDashboard() {
  const { user } = useContext(AuthContext);
  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="max-w-5xl mx-auto mt-4 px-4">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-800">Olá, {firstName}!</h1>
        <p className="mt-2 text-gray-600">O que você precisa hoje?</p>
        
        <div className="mt-6 relative">
          {/* MUDANÇA AQUI: Adicionadas classes de cor de texto e de foco */}
          <input 
            type="search"
            placeholder="Busque por médicos, especialidades, exames..."
            className="w-full rounded-full border-gray-300 p-4 pl-12 text-lg text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nossos Serviços</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          {serviceCards.map((card) => (
            <Link key={card.name} href={card.href}>
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center h-full ">
                <card.icon className="w-10 h-10 text-blue-600 mb-4"/>
                <h3 className="font-semibold text-gray-900 mb-2">{card.name}</h3>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}