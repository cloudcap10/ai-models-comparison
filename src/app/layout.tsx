import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SITE_URL = 'https://pickmodel.uk';
const SITE_NAME = 'PickModel';
const TITLE = 'PickModel — Compare AI Models Side by Side';
const DESCRIPTION =
  'Free, up-to-date comparison of AI language models. Compare Claude, GPT-4o, Gemini, Llama and more by context window, price, reasoning, speed, and features.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'AI model comparison',
    'LLM comparison',
    'compare LLMs',
    'Claude vs GPT-4',
    'best AI model',
    'LLM pricing',
    'AI model benchmark',
    'GPT-4o',
    'Claude Sonnet',
    'Gemini Pro',
    'Llama 3',
    'large language model',
    'which LLM to use',
    'AI API pricing',
    'LLM context window',
  ],
  authors: [{ name: 'PickModel', url: SITE_URL }],
  creator: 'PickModel',
  publisher: 'PickModel',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: 'PickModel — Compare AI Models Side by Side',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href={SITE_URL} />
      </head>
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
              href="https://github.com/cloudcap10/ai-models-comparison"
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
