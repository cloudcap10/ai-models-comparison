import Link from 'next/link';
import { ArrowLeft, Database, Users, RefreshCw, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={15} />
        Back
      </Link>

      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
        About
      </h1>
      <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
        How this site works and how to contribute.
      </p>

      <div className="space-y-4">
        {[
          {
            icon: <Database size={20} style={{ color: 'var(--accent)' }} />,
            title: 'Data-driven',
            body: 'All model data lives in a single YAML file (models-data.yml) at the root of the repository. Each entry contains the model name, provider, context window, pricing, capabilities, and feature flags. Editing that one file is all you need to update or add a model.',
          },
          {
            icon: <RefreshCw size={20} style={{ color: 'var(--green)' }} />,
            title: 'Regularly updated',
            body: 'AI moves fast. We aim to update the data whenever major models are released or existing models change their pricing or capabilities. Pull requests with data updates are always welcome.',
          },
          {
            icon: <Users size={20} style={{ color: 'var(--blue)' }} />,
            title: 'Community maintained',
            body: 'This project is open source and relies on contributions from the community. Found a mistake? Want to add a model? Open a PR or an issue on GitHub.',
          },
          {
            icon: <Code size={20} style={{ color: 'var(--yellow)' }} />,
            title: 'Tech stack',
            body: 'Built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion. Data is loaded from YAML at build time — no database required. Fully static and fast.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              {item.icon}
              <h2 className="font-semibold" style={{ color: 'var(--text)' }}>{item.title}</h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-2xl p-6"
        style={{
          background: 'var(--accent-glow)',
          border: '1px solid var(--accent-dim)',
        }}
      >
        <h2 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>
          How to add a model
        </h2>
        <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: 'var(--text-muted)' }}>
          <li>Fork the repository on GitHub</li>
          <li>Edit <code className="feature-tag">models-data.yml</code> — add a new entry following the schema</li>
          <li>Add the provider icon to <code className="feature-tag">public/icons/</code> (SVG, 24×24)</li>
          <li>Open a pull request with your changes</li>
        </ol>
      </div>
    </div>
  );
}
