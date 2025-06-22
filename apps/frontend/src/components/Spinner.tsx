// Endereço: apps/frontend/src/components/Spinner.tsx

export function Spinner() {
  return (
    <div
      className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"
      role="status"
      aria-label="Carregando..."
    />
  );
}