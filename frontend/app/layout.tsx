import type { Metadata } from 'next';
import './globals.css';
import { PersonaProvider } from '@/lib/persona-context';
import PersonaSwitcher from '@/components/PersonaSwitcher';

export const metadata: Metadata = {
  title: 'WealthDrop',
  description: 'Income-fair gamified savings for GXBank',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <PersonaProvider>
          <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-800">
            <span className="text-lg font-bold tracking-tight text-white">
              Wealth<span className="text-emerald-400">Drop</span>
            </span>
            <PersonaSwitcher />
          </header>
          <main className="pt-16">{children}</main>
        </PersonaProvider>
      </body>
    </html>
  );
}
