import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    'best AI model 2025',
    'LLM pricing',
    'AI model benchmark',
    'AI API cost calculator',
    'GPT-4o vs Claude',
    'Claude vs Gemini',
    'Claude Sonnet 4',
    'GPT-4o',
    'Gemini 2.5 Pro',
    'Llama 4 Maverick',
    'DeepSeek V3',
    'o3 benchmark',
    'large language model',
    'which LLM to use',
    'AI API pricing',
    'LLM context window',
    'MMLU benchmark',
    'cheapest AI API',
    'fastest LLM',
    'open source LLM',
    'AI model specs',
    'compare Claude GPT Gemini',
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
    <html lang="en-GB" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href={SITE_URL} />
      </head>
      <body>
        <TooltipProvider>
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
              href="https://github.com/cloudcap10/pickmodel"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              Contribute on GitHub
            </a>
          </p>
        </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
