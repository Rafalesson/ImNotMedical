// src/components/Footer.tsx (versão com texto sempre centralizado)
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl py-6 px-4 text-center text-xs text-gray-500">
        <p>
          &copy; {currentYear} | Todos os direitos reservados à Zello.
        </p>
      </div>
    </footer>
  );
}