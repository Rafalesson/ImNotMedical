'use client';

import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogIn, LogOut, Menu, X, Info, Play, Users, Mail } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthProvider';

type ActionOptions = {
  fullWidth?: boolean;
  onAction?: () => void;
};

const navLinks = [
  { label: 'Por que Zello?', href: '/#features' },
  { label: 'Como Funciona', href: '/#how-it-works' },
  { label: 'Sobre Nós', href: '/#about' },
  { label: 'Contato', href: '/#contato' },
];

const navIcons = [Info, Play, Users, Mail];

export function Header() {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false); // keeps menu in DOM while animating out
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const hideButtonOnRoutes = ['/validar', '/receitas/validar', '/recuperar-senha', '/redefinir-senha', '/cadastro'];
  const shouldHideActions = hideButtonOnRoutes.some((route) => pathname.startsWith(route));
  const isValidationRoute = pathname.startsWith('/validar') || pathname.startsWith('/receitas/validar');

  const baseActionClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  const renderPrimaryAction = (options: ActionOptions = {}) => {
    const widthClass = options.fullWidth ? ' w-full justify-center' : '';

    if (isAuthenticated) {
      if (user?.role === 'DOCTOR') {
        return (
          <Link
            href="/dashboard"
            onClick={options.onAction}
            className={`${baseActionClasses} border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white focus-visible:outline-slate-900${widthClass}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        );
      }

      const handleSignOut = () => {
        signOut();
        options.onAction?.();
      };

      return (
        <button
          type="button"
          onClick={handleSignOut}
          className={`${baseActionClasses} border border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus-visible:outline-red-600${widthClass}`}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      );
    }

    return (
      <Link
        href="/login"
        onClick={options.onAction}
        className={`${baseActionClasses} border border-blue-600 text-blue-600 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:text-white focus-visible:outline-blue-600${widthClass}`}
      >
        <LogIn className="h-4 w-4" />
        Começar agora
      </Link>
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((previous) => {
      const next = !previous;
      if (next) setIsMenuVisible(true);
      return next;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // manage mount/unmount for animation
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMenuVisible(true);
    } else if (isMenuVisible) {
      // wait for animation to finish before removing from DOM
      const t = setTimeout(() => setIsMenuVisible(false), 200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isMobileMenuOpen, isMenuVisible]);

  // focus management and keyboard handling
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    // focus first link inside panel
    requestAnimationFrame(() => {
      const firstLink = panelRef.current?.querySelector('a');
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMobileMenu();
        // restore focus after anim
        setTimeout(() => menuButtonRef.current?.focus(), 200);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  // lock body scroll while menu is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
    }

    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isMobileMenuOpen]);

  // when menu is closed programmatically (by overlay/X/primary action), ensure focus returns
  useEffect(() => {
    if (!isMobileMenuOpen && !isMenuVisible) {
      // fully closed
      menuButtonRef.current?.focus();
    }
  }, [isMobileMenuOpen, isMenuVisible]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
  <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 transition-all duration-200 sm:px-6 lg:px-8 lg:py-5">
        {isValidationRoute ? (
          <div className="-m-1.5 p-1.5 cursor-default" aria-disabled="true">
            <span className="text-2xl font-semibold tracking-tight text-slate-900">Zello</span>
          </div>
        ) : (
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-semibold tracking-tight text-slate-900">Zello</span>
          </Link>
        )}

        {!shouldHideActions && (
          <>
            <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex">{renderPrimaryAction()}</div>

            <button
              type="button"
              ref={menuButtonRef}
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 lg:hidden"
              aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}
      </nav>

      {typeof document !== 'undefined' && !shouldHideActions && isMenuVisible
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex lg:hidden">
              <div
                role="presentation"
                onClick={closeMobileMenu}
                className={`absolute inset-0 bg-slate-900 transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-40' : 'opacity-0' } pointer-events-auto`}
              />

              <div
                id="mobile-navigation"
                ref={panelRef}
                className={`relative left-0 flex h-full w-[75vw] max-w-sm flex-col bg-white shadow-2xl transform transition-transform duration-200 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                aria-hidden={!isMobileMenuOpen}
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                  {isValidationRoute ? (
                    <div className="-m-1.5 p-1.5 cursor-default" aria-disabled="true">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">Zello</span>
                    </div>
                  ) : (
                    <Link href="/" className="-m-1.5 p-1.5">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">Zello</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-600 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    aria-label="Fechar menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="px-4 py-8 text-slate-700">
                  <ul className="space-y-6">
                    {navLinks.map((link, i) => {
                      const Icon = navIcons[i];
                      return (
                        <li key={`mobile-${link.label}`}>
                          <Link
                            href={link.href}
                            onClick={closeMobileMenu}
                            className="group flex items-center text-lg font-medium transition-colors duration-200 text-slate-700 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          >
                            <Icon className="h-5 w-5 mr-3 text-slate-500 transition-colors duration-200 group-hover:text-blue-600" />
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="mt-auto border-t border-slate-100 px-4 py-6">
                  {renderPrimaryAction({ fullWidth: true, onAction: closeMobileMenu })}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
