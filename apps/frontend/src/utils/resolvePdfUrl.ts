// Garante que a UI lide tanto com URLs relativas quanto absolutas para PDFs.
export function resolvePdfUrl(pdfUrl: string | null | undefined): string {
  if (!pdfUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(pdfUrl)) {
    return pdfUrl;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
  return `${baseUrl}${pdfUrl}`;
}
