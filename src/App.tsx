import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Home, 
  Briefcase, 
  BookOpen, 
  Mail, 
  LayoutDashboard, 
  LogOut, 
  LogIn,
  Menu,
  X,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from './lib/utils';

// Pages
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import ProjectsPage from './pages/ProjectsPage';
import GalleryPage from './pages/GalleryPage';

const Navbar = () => {
  const { user, isAdmin, login, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white">
          A<span className="text-blue-500">A</span>H
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white flex items-center gap-2",
                location.pathname === link.path ? "text-white" : "text-white/60"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin" className="p-2 text-white/60 hover:text-white transition-colors">
              <LayoutDashboard size={20} />
            </Link>
          )}

          {user ? (
            <button onClick={() => logout()} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full transition-all">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button onClick={() => login()} className="flex items-center gap-2 bg-white text-black hover:bg-white/90 text-xs px-4 py-2 rounded-full font-bold transition-all">
              <LogIn size={14} />
              <span>Admin Login</span>
            </button>
          )}

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-white/80 hover:text-white flex items-center gap-4"
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <footer className="py-20 border-t border-white/10 bg-black/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
             <h2 className="text-2xl font-bold tracking-tighter">Àbdüllāh Aĺ Hỗŝŝâîň</h2>
             <p className="text-white/40 text-sm mt-2">© 2026 Premium Portfolio. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
