// src/app/dashboard/layout.tsx
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}