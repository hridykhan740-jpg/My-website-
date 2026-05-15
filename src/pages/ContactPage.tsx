import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: Date.now(),
        read: false
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20 overflow-x-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h1 className="text-6xl font-bold tracking-tighter mb-8 leading-none">
                Let's <br />
                <span className="text-blue-500">Connect.</span>
              </h1>
              <p className="text-white/60 text-lg mb-12">
                Whether you have a premium project in mind, a collaboration proposal, 
                or just want to say hi, my digital door is always open.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Mail, label: "Email", value: "hridykhan740@gmail.com" },
                  { icon: Phone, label: "Phone", value: "+880 123 456 789" },
                  { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all">
                      <item.icon className="text-white group-hover:text-blue-400 transition-colors" size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-bold">{item.label}</p>
                      <p className="text-lg font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 flex gap-6">
                {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 p-8 md:p-12 rounded-[3.5rem] relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-white/40 mb-4 ml-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Abdullah Al Hossain"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-white/40 mb-4 ml-2">Your Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="hello@example.com"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-white/40 mb-4 ml-2">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell me about your project..."
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 h-40 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status !== 'idle'}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  {status === 'sending' ? 'Transmitting...' : status === 'success' ? 'Message Sent!' : 'Send Message'} 
                  <Send size={18} />
                </button>
              </form>
              
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-400 text-sm font-medium text-center"
                >
                  Message received successfully. I'll get back to you within 24 hours.
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
