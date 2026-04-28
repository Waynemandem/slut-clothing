// ✅ After
import type { ReactNode, JSX } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from '../components/PageTransition';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;