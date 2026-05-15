import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ExternalLink, Github, Code, Globe, Eye } from 'lucide-react';
import { Project } from '../types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
    return () => unsub();
  }, []);

  const categories = ['All', 'Web', 'Mobile', 'UI/UX', 'Cloud'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20 text-center mx-auto">
          <h1 className="text-6xl font-bold tracking-tighter mb-6">Visionary <span className="text-blue-500">Craft</span></h1>
          <p className="text-white/40 text-xl leading-relaxed">
            A meticulous collection of world-class digital products built with a focus 
            on performance, aesthetics, and user experience.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all border ${
                filter === cat 
                  ? "bg-white text-black border-white" 
                  : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] bg-zinc-900 rounded-[3rem] overflow-hidden relative mb-8">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                  <a href="#" className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <ExternalLink size={24} />
                  </a>
                  <a href="#" className="w-14 h-14 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Github size={24} />
                  </a>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="text-3xl font-bold mb-3 tracking-tight group-hover:text-blue-500 transition-colors">
                {project.title}
              </h3>
              <p className="text-white/40 text-lg leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
