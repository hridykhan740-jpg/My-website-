import React from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, Maximize2, Play } from 'lucide-react';
import { cn } from '../lib/utils';

const GalleryItem = (props: { i: number; key?: any }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className={cn(
      "relative rounded-[2.5rem] overflow-hidden group cursor-pointer",
      props.i % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[3/4]"
    )}
  >
    <img 
      src={`https://images.unsplash.com/photo-${1500000000000 + props.i * 100000}?q=80&w=1200&auto=format&fit=crop`} 
      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
      alt="Gallery"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
       <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/60 mb-2">Life In Perspective</span>
       <h4 className="text-2xl font-bold">Studio Session {props.i + 1}</h4>
    </div>
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
       <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
          <Maximize2 size={18} />
       </div>
    </div>
  </motion.div>
);


export default function GalleryPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20 overflow-x-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <h1 className="text-7xl font-bold tracking-tighter mb-8 italic">Static <br /> Motion.</h1>
          <p className="text-white/40 text-xl leading-relaxed max-w-2xl">
            A visual journal of travels, inspirations, and the lifestyle behind the code. 
            Captured through the lens of premium aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(10)].map((_, i) => (
             <GalleryItem key={i} i={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
