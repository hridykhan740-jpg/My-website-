import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Blog } from '../types';
import { formatDate } from '../lib/utils';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog)));
    });
    return () => unsub();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20 overflow-x-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">
            <div>
              <h1 className="text-7xl font-bold tracking-tighter mb-8 leading-none">The <br /> <span className="text-purple-500">Archive.</span></h1>
              <p className="text-white/40 text-xl max-w-xl">Thought leadership on modern design, full-stack engineering, and digital growth.</p>
            </div>

            <div className="space-y-16">
              {blogs.length > 0 ? blogs.map((blog) => (
                <motion.article 
                  key={blog.id}
                  className="group cursor-pointer border-b border-white/5 pb-16"
                >
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-80 flex-shrink-0 aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden">
                       <img src={blog.image} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                    </div>
                    <div>
                        <div className="flex gap-4 mb-6">
                          {blog.tags?.map(t => (
                            <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t}</span>
                          ))}
                        </div>
                        <h2 className="text-3xl font-bold mb-4 group-hover:text-purple-400 transition-colors">{blog.title}</h2>
                        <p className="text-white/40 text-lg mb-8 line-clamp-3">{blog.content}</p>
                        <div className="flex items-center gap-6 text-xs font-mono uppercase text-white/20">
                          <span className="flex items-center gap-2"><Calendar size={14} /> {formatDate(blog.date)}</span>
                          <span className="flex items-center gap-2"><Clock size={14} /> 5 min read</span>
                        </div>
                    </div>
                  </div>
                </motion.article>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                   <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-white/40">No entries in the archive yet.</h3>
                   <p className="text-white/20 mt-2">The admin is currently drafting premium content.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 h-fit space-y-12">
            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem]">
               <h3 className="text-xl font-bold mb-6">Newsletter</h3>
               <p className="text-white/40 text-sm mb-8 leading-relaxed">Join 5,000+ subscribers and get my latest insights directly in your inbox.</p>
               <input 
                 type="email" 
                 placeholder="Enter your email"
                 className="w-full bg-white/5 border border-white/10 p-4 rounded-xl mb-4 focus:border-purple-500 outline-none"
               />
               <button className="w-full bg-white text-black py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform">
                 Subscribe
               </button>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem]">
               <h3 className="text-xl font-bold mb-6">Trending Tags</h3>
               <div className="flex flex-wrap gap-3">
                 {['React', 'NextJS', 'Firebase', 'Minimalism', 'Web3', 'Growth'].map(tag => (
                   <span key={tag} className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-medium cursor-pointer hover:border-white/20 transition-all">{tag}</span>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
