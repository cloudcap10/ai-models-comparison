'use client';

import { Brain, GitFork } from 'lucide-react';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="sticky-header">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm">
          <Brain size={18} style={{ color: 'var(--accent)' }} />
          <span style={{ color: 'var(--text)' }}>PickModel</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="#table"
            className="text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
            }}
          >
            Compare
          </Link>
          <Link
            href="/about"
            className="text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
            }}
          >
            About
          </Link>
          <a
            href="https://github.com/cloudcap10/pickmodel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
            }}
          >
            <GitFork size={15} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
