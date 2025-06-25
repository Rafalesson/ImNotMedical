// Endereço: apps/frontend/src/components/Footer.tsx (Exemplo)

export function Footer() {
  return (
    // Usamos a mesma variável CSS do Header para garantir a mesma altura (5rem)
    // As classes flex e items-center o centralizam verticalmente.
    <footer className="bg-white h-[var(--header-height)] flex items-center justify-center border-t">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Todos os direitos reservados à Zello.
      </p>
    </footer>
  );
}