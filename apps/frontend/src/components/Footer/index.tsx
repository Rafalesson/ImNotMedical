'use client';

import Link from 'next/link';

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
];

export function Footer() {
  return (
    <footer id="contato" className="bg-[#0f172a] text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <span className="text-2xl font-semibold">Zello</span>
            <p className="text-sm leading-6 text-slate-200">
              Plataforma digital que aproxima médicos e pacientes com segurança, empatia e eficiência em cada atendimento.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-200">
              <span className="h-2 w-2 rounded-lg bg-blue-400" aria-hidden="true" />
              Conforme LGPD
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-200">Termos e Políticas</h3>
            <ul className="space-y-3 text-sm text-slate-200">
              <li>
                <Link href="/termos" className="transition-colors duration-200 hover:text-blue-300">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="transition-colors duration-200 hover:text-blue-300">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/seguranca" className="transition-colors duration-200 hover:text-blue-300">
                  Segurança e Compliance
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-200">Contato</h3>
            <ul className="space-y-3 text-sm text-slate-200">
              <li>
                <a href="mailto:contato@zello.com" className="transition-colors duration-200 hover:text-blue-300">
                  contato@zello.com
                </a>
              </li>
              <li className="flex flex-col gap-2">
                <span>Redes sociais</span>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-sm font-medium text-blue-200 transition-colors duration-200 hover:text-blue-300"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </li>
              <li>
                <span className="text-sm text-slate-400">Suporte: segunda a sexta, 8h às 18h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10">
          <div className="flex flex-col gap-3 px-0 py-3 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2025 Zello | Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}



