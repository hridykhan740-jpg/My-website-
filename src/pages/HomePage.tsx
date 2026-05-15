import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, collection, query, orderBy, limit, getDoc, setDoc } from 'firebase/firestore';
import { ArrowRight, Code, Palette, Smartphone, Globe, ExternalLink, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Project, Skill, Comment } from '../types';
import { useAuth } from '../lib/AuthContext';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-4">Visionary Full Stack Developer</h2>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-none">
            Àbdüllāh Aĺ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Hỗŝŝâîň
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed">
            Crafting premium digital experiences through ultra-modern design, 
            cinematic animations, and world-class engineering.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
              View My Work <ArrowRight size={18} />
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all">
              Contact Me
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

const SkillsSection = () => {
  const skills = [
    { name: "Frontend Architecture", icon: Globe, color: "text-blue-400" },
    { name: "UI/UX Experience", icon: Palette, color: "text-purple-400" },
    { name: "Mobile Solutions", icon: Smartphone, color: "text-green-400" },
    { name: "Cloud Engineering", icon: Code, color: "text-amber-400" },
  ];

  return (
    <section className="py-32 bg-zinc-950/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl hover:border-white/20 transition-all group"
            >
              <skill.icon className={cn("w-12 h-12 mb-6 transition-transform group-hover:scale-110", skill.color)} />
              <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
              <p className="text-white/40 text-sm">Building scalable, performant, and beautiful digital products with precision.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LiveCounter = () => {
  const [stats, setStats] = useState({ visitorCount: 0 });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'stats', 'totals'), (doc) => {
      if (doc.exists()) {
        setStats(doc.data() as any);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-blue-600 rounded-[3rem] text-white">
      <span className="text-5xl font-black mb-2">{stats.visitorCount.toLocaleString()}</span>
      <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-80">Live Global Visitors</span>
    </div>
  );
};

const ProjectsPreview = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(3));
    const unsub = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
    return () => unsub();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Elite Projects</h2>
            <p className="text-white/40">A selection of my most impactful digital creations.</p>
          </div>
          <button className="text-white/60 hover:text-white transition-colors flex items-center gap-2 font-medium">
            View All Projects <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="aspect-video bg-zinc-900 rounded-3xl mb-6 overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <ExternalLink className="text-white w-10 h-10" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2 transition-colors group-hover:text-blue-400">{project.title}</h3>
              <p className="text-white/40 text-sm line-clamp-2">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CommentsSection = () => {
  const { user, login } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'), limit(5));
    const unsub = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await setDoc(doc(collection(db, 'comments')), {
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        content: newComment,
        createdAt: Date.now()
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <section className="py-32 bg-zinc-950/50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tighter mb-4">Visitor Feedback</h2>
          <p className="text-white/40">What the digital community is saying.</p>
        </div>

        <div className="mb-12">
          {user ? (
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a public comment..."
                className="w-full bg-zinc-900 border border-white/10 rounded-3xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500 transition-all min-h-[120px]"
              />
              <button 
                type="submit"
                className="absolute bottom-4 right-4 bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
              >
                Post
              </button>
            </form>
          ) : (
            <div className="p-12 border-2 border-dashed border-white/10 rounded-[3rem] text-center">
              <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 mb-6">Join the conversation and leave your feedback.</p>
              <button 
                onClick={() => login()}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Sign In to Comment
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {comments.map((comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 flex gap-4"
            >
              <img src={comment.userPhoto} alt={comment.userName} className="w-12 h-12 rounded-full flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm mb-1">{comment.userName}</h4>
                <p className="text-white/80">{comment.content}</p>
                <p className="text-white/20 text-xs mt-2">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-0"
    >
      <Hero />
      <SkillsSection />
      
      {/* Bio / About Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-zinc-900 rounded-[3rem] overflow-hidden">
                 <img 
                   src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                   alt="Biography" 
                   className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                 />
              </div>
              <div className="absolute -bottom-10 -right-10 hidden md:block">
                <LiveCounter />
              </div>
            </div>
            
            <div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 italic">Crafting legacies, <br />not just websites.</h2>
              <div className="space-y-6 text-white/60 text-lg leading-relaxed">
                <p>
                  I am Àbdüllāh Aĺ Hỗŝŝâîň, a multi-disciplinary developer and designer 
                  focused on the intersection of aesthetic brilliance and functional perfection.
                </p>
                <p>
                  My philosophy is simple: Every pixel must serve a purpose, and every interaction 
                  must spark joy. I build platforms that don't just work—they inspire.
                </p>
                <p>
                  With over 100+ premium projects delivered worldwide, I specialize in creating 
                  high-stakes digital ecosystems for luxury brands and industry leaders.
                </p>
              </div>
              <div className="mt-12 flex gap-12 border-t border-white/10 pt-12">
                <div>
                   <span className="block text-3xl font-bold">100+</span>
                   <span className="text-xs uppercase text-white/40 tracking-widest mt-1">Projects</span>
                </div>
                <div>
                   <span className="block text-3xl font-bold">5+</span>
                   <span className="text-xs uppercase text-white/40 tracking-widest mt-1">Years</span>
                </div>
                <div>
                   <span className="block text-3xl font-bold">50+</span>
                   <span className="text-xs uppercase text-white/40 tracking-widest mt-1">Clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectsPreview />
      <CommentsSection />
    </motion.div>
  );
}
