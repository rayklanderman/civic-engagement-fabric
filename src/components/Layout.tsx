import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <Outlet />
      </main>
      <footer className="bg-kenya-black text-kenya-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Sauti ya Wananchi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
