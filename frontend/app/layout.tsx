import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { PersonaProvider } from '@/lib/persona-context';
import PersonaSwitcher from '@/components/PersonaSwitcher';

export const metadata: Metadata = {
  title: 'WealthDrop — Income-Fair Gamified Savings',
  description:
    'WealthDrop reads your GXBank transactions for behavioral patterns, generates a unique living creature, and lets you battle friends on improvement velocity — never on income.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col">
        <PersonaProvider>
          {/* Fixed top nav */}
          <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-800">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
            >
              Wealth<span className="text-emerald-400">Drop</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-5 text-sm text-slate-400">
              <Link href="/dashboard" className="hover:text-slate-100 transition-colors">Dashboard</Link>
              <Link href="/battle"    className="hover:text-slate-100 transition-colors">Battle</Link>
            </nav>

            <PersonaSwitcher />
          </header>

          {/* Page content — grows to fill remaining height */}
          <main className="pt-16 flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-800 bg-slate-900/50 px-6 py-4">
            <p className="text-center text-xs text-slate-600">
              WealthDrop — built for GXBank &middot; UTMxHackathon 2026 &middot;{' '}
              <span className="text-slate-700">
                Income amounts are never shared between users. Battle rewards are cosmetic-only.
              </span>
            </p>
          </footer>
        </PersonaProvider>
      </body>
    </html>
  );
}
