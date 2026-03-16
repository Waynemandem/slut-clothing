// ─────────────────────────────────────────────────────────────────────────────
// src/layout/Layout.tsx
// Wraps every page with Navbar + Footer.
// Usage in App.tsx: <Route path="/" element={<Layout><Home /></Layout>} />
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;