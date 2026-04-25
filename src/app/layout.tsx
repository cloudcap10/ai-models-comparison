import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Model Comparison',
  description:
    'An objective, data-driven comparison of AI language models — context windows, pricing, capabilities and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <footer
          className="text-center py-10 text-xs"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-faint)',
          }}
        >
          <p>
            Data is community-maintained. Prices and specs may change — always verify with official
            provider documentation.
          </p>
          <p className="mt-2">
            MIT License ·{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              Contribute on GitHub
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
