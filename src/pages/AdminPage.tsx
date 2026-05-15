import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  updateDoc,
  increment,
  getDocs
} from 'firebase/firestore';
import { 
  Users, 
  MessageSquare, 
  Layout, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle,
  Clock,
  TrendingUp,
  Image as ImageIcon,
  Files,
  LogOut,
  Mail,
  Settings,
  X
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { Project, Visitor, Message, Comment } from '../types';

const DashboardCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl bg-opacity-20", color.replace('text-', 'bg-'))}>
        <Icon className={color} size={24} />
      </div>
      <TrendingUp size={16} className="text-green-500" />
    </div>
    <h3 className="text-white/40 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default function AdminPage() {
  const { user, isAdmin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'visitors' | 'messages' | 'comments'>('overview');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState({ visitorCount: 0 });

  // Form State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
  });

  useEffect(() => {
    if (!isAdmin) return;

    // Fetch Stats
    const unsubStats = onSnapshot(doc(db, 'stats', 'totals'), (doc) => {
      if (doc.exists()) setStats(doc.data() as any);
    });

    // Fetch Projects
    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });

    // Fetch Visitors
    const unsubVisitors = onSnapshot(query(collection(db, 'visitors'), orderBy('lastVisit', 'desc')), (snapshot) => {
      setVisitors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Visitor)));
    });

    // Fetch Messages
    const unsubMessages = onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    // Fetch Comments
    const unsubComments = onSnapshot(query(collection(db, 'comments'), orderBy('createdAt', 'desc')), (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });

    return () => {
      unsubStats();
      unsubProjects();
      unsubVisitors();
      unsubMessages();
      unsubComments();
    };
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen grid place-items-center"><Clock className="animate-spin" /></div>;
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <X className="text-red-500" size={40} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-white/60 mb-8 max-w-md">Only the authenticated owner (hridykhan740@gmail.com) can access this dashboard.</p>
        <button onClick={() => window.location.href = '/'} className="bg-white text-black px-8 py-3 rounded-full font-bold">Return Home</button>
      </div>
    );
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        tags: newProject.tags.split(',').map(t => t.trim()),
        createdAt: Date.now()
      });
      setIsAddingProject(false);
      setNewProject({ title: '', description: '', image: '', tags: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedData = async () => {
    if (!isAdmin) return;
    try {
      // Seed Projects
      const projectSeeds = [
        { title: "Lumina Crypto Dashboard", description: "A high-performance trading interface with real-time data visualization.", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop", tags: ["React", "D3.js", "Firebase"], createdAt: Date.now() },
        { title: "Aura Smart Home App", description: "Mobile-first IoT management platform for modern connected living.", image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop", tags: ["Flutter", "Node.js", "AWS"], createdAt: Date.now() - 100000 },
        { title: "Zenith E-commerce", description: "Premium fashion marketplace focusing on minimal aesthetics and fast checkout.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop", tags: ["Next.js", "Stripe", "Tailwind"], createdAt: Date.now() - 200000 },
      ];
      for (const p of projectSeeds) {
        await addDoc(collection(db, 'projects'), p);
      }

      // Seed Blogs
      const blogSeeds = [
        { title: "The Future of Minimalist Design", content: "Exploring how less is becoming more in the age of digital noise...", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop", date: Date.now(), tags: ["Design", "UI"], author: "Abdullah" },
        { title: "Scaling Firestore for Millions", content: "A deep dive into indexing, sharding, and cost optimization techniques...", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2021&auto=format&fit=crop", date: Date.now() - 500000, tags: ["Backend", "Firebase"], author: "Abdullah" },
      ];
      for (const b of blogSeeds) {
        await addDoc(collection(db, 'blogs'), b);
      }
      alert("Sample data successfully seeded!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 overflow-x-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2">Admin Command Center</h1>
            <p className="text-white/40">Securely managing your premium portfolio and visitor data.</p>
            <button onClick={handleSeedData} className="mt-4 text-[10px] uppercase tracking-widest text-blue-500 font-bold hover:underline">Seed Sample Data</button>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
               {visitors.slice(0, 5).map(v => (
                 <img key={v.id} src={v.photo} className="w-10 h-10 rounded-full border-2 border-black" title={v.name} />
               ))}
               {visitors.length > 5 && (
                 <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[10px] font-bold">
                   +{visitors.length - 5}
                 </div>
               )}
             </div>
             <button onClick={() => logout()} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors">
               <LogOut size={20} />
             </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-12 pb-2 no-scrollbar">
          {[
            { id: 'overview', icon: Layout, label: 'Overview' },
            { id: 'projects', icon: Files, label: 'Projects' },
            { id: 'visitors', icon: Users, label: 'Visitors' },
            { id: 'messages', icon: Mail, label: 'Messages' },
            { id: 'comments', icon: MessageSquare, label: 'Comments' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-white text-black" : "bg-white/5 hover:bg-white/10 text-white/60"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <DashboardCard title="Total Visitors" value={stats.visitorCount} icon={Users} color="text-blue-500" />
                <DashboardCard title="Projects Live" value={projects.length} icon={Files} color="text-purple-500" />
                <DashboardCard title="Messages Received" value={messages.length} icon={Mail} color="text-green-500" />
                <DashboardCard title="Public Comments" value={comments.length} icon={MessageSquare} color="text-amber-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-xl font-bold mb-6">Recent Visitors</h3>
                    <div className="space-y-4">
                      {visitors.slice(0, 5).map(v => (
                        <div key={v.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <img src={v.photo} className="w-10 h-10 rounded-full" />
                            <div>
                               <p className="font-bold text-sm">{v.name}</p>
                               <p className="text-white/40 text-[10px] uppercase font-mono">{formatDate(v.lastVisit)}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg">Active</span>
                        </div>
                      ))}
                    </div>
                </div>
                
                <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-xl font-bold mb-6">Latest Comments</h3>
                    <div className="space-y-4">
                      {comments.slice(0, 5).map(c => (
                        <div key={c.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl">
                          <img src={c.userPhoto} className="w-8 h-8 rounded-full flex-shrink-0" />
                          <div>
                             <p className="font-bold text-xs mb-1">{c.userName}</p>
                             <p className="text-white/60 text-xs line-clamp-2">{c.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Manage Portfolio</h3>
                <button 
                  onClick={() => setIsAddingProject(true)}
                  className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
                >
                  <Plus size={18} /> New Project
                </button>
              </div>

              {isAddingProject && (
                <div className="fixed inset-0 z-[100] grid place-items-center p-6">
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddingProject(false)} />
                  <motion.form 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onSubmit={handleAddProject}
                    className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg space-y-4"
                  >
                    <h2 className="text-2xl font-bold mb-6">Add Project</h2>
                    <input 
                      type="text" placeholder="Project Title" required
                      value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" 
                    />
                    <textarea 
                      placeholder="Description" required
                      value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-4 rounded-xl h-32 focus:border-blue-500 outline-none"
                    />
                    <input 
                      type="text" placeholder="Image URL (Unsplash/Any)" required
                      value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" 
                    />
                    <input 
                      type="text" placeholder="Tags (comma separated)" 
                      value={newProject.tags} onChange={e => setNewProject({...newProject, tags: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" 
                    />
                    <div className="flex gap-4 pt-4">
                      <button type="submit" className="flex-1 bg-white text-black py-4 rounded-2xl font-bold">Publish Project</button>
                      <button type="button" onClick={() => setIsAddingProject(false)} className="flex-1 bg-white/5 py-4 rounded-2xl">Cancel</button>
                    </div>
                  </motion.form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl flex gap-6 items-center group">
                    <img src={p.image} className="w-24 h-24 object-cover rounded-2xl" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{p.title}</h4>
                      <p className="text-white/40 text-xs mb-4">{formatDate(p.createdAt)}</p>
                      <div className="flex gap-2">
                        <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Eye size={16} /></button>
                        <button onClick={() => deleteDoc(doc(db, 'projects', p.id))} className="p-2 bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'visitors' && (
            <motion.div key="visitors" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="p-6 font-mono text-xs text-white/40 uppercase tracking-widest">Visitor</th>
                      <th className="p-6 font-mono text-xs text-white/40 uppercase tracking-widest">Email</th>
                      <th className="p-6 font-mono text-xs text-white/40 uppercase tracking-widest">Device</th>
                      <th className="p-6 font-mono text-xs text-white/40 uppercase tracking-widest">Visits</th>
                      <th className="p-6 font-mono text-xs text-white/40 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map(v => (
                      <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <img src={v.photo} className="w-8 h-8 rounded-full" />
                            <span className="font-bold text-sm">{v.name}</span>
                          </div>
                        </td>
                        <td className="p-6 text-sm text-white/60">{v.email}</td>
                        <td className="p-6 text-xs text-white/40 font-mono truncate max-w-[200px]">{v.device}</td>
                        <td className="p-6">
                           <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-bold">{v.visitCount || 1}</span>
                        </td>
                        <td className="p-6">
                           <a href={`mailto:${v.email}`} className="text-blue-500 hover:underline flex items-center gap-1 text-xs">
                             <Mail size={12} /> Contact
                           </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Messages & Comments tabs would follow similar modern luxury patterns */}
        </AnimatePresence>
      </div>
    </div>
  );
}
