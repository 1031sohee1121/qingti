'use client';

import { useEffect, useState } from 'react';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    { id: 'predict', label: '测一测' },
    { id: 'portrait', label: '健康画像' },
    { id: 'suggestions', label: '建议' },
    { id: 'knowledge', label: '科普' },
    { id: 'tracker', label: '追踪' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-cream/85 backdrop-blur-xl border-b border-border-soft/20' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Logo />
          <span className="font-serif text-2xl font-medium tracking-tight">轻体</span>
          <span className="text-xs text-text-muted ml-1 tracking-widest hidden md:inline">QING · TI</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {items.map(it => (
            <a key={it.id} href={`#${it.id}`} className="text-sm text-text-soft hover:text-coral transition-colors relative group">
              {it.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-coral group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        <a href="#predict" className="bg-ink text-cream text-sm px-5 py-2.5 rounded-full hover:bg-coral transition-all duration-300">
          开始
        </a>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" stroke="#2C2926" strokeWidth="1.5" />
      <path d="M11 21 Q 18 13, 25 21" stroke="#D17A5C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="14" r="2" fill="#7A9B7E" />
    </svg>
  );
}
