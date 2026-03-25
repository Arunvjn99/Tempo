/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
      >
        
        {/* Left: Illustration */}
        <div 
          className="w-full md:w-[280px] shrink-0 aspect-[4/3] md:aspect-auto md:h-[200px] bg-[#F8FAFC] rounded-2xl relative overflow-hidden flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          {/* Modern Mesh Gradient Background */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300/40 rounded-full blur-3xl"></div>
            <div className="absolute top-10 -right-10 w-40 h-40 bg-blue-300/40 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 left-10 w-40 h-40 bg-emerald-300/40 rounded-full blur-3xl"></div>
          </div>

          {/* Abstract Wireframe Rings */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-48 h-48 border-[0.5px] border-slate-300/50 rounded-full"
          />
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="absolute w-48 h-48 border-[0.5px] border-slate-300/30 rounded-full"
          />

          {/* Floating Dark Card (Fintech Vibe) */}
          <motion.div
            initial={{ y: 30, rotateX: 30, rotateY: -20, opacity: 0 }}
            animate={{ y: 0, rotateX: 15, rotateY: -15, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="absolute w-44 h-28 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl shadow-2xl border border-slate-700/50 p-4 flex flex-col justify-between z-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex justify-between items-start">
              <div className="w-8 h-5 rounded bg-gradient-to-br from-amber-200 to-amber-400 opacity-90 shadow-inner"></div>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-1.5 bg-slate-600 rounded-full"></div>
              <div className="flex gap-1">
                <div className="w-4 h-1.5 bg-slate-700 rounded-full"></div>
                <div className="w-4 h-1.5 bg-slate-700 rounded-full"></div>
                <div className="w-4 h-1.5 bg-slate-700 rounded-full"></div>
                <div className="w-8 h-1.5 bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Floating Growth Pill */}
          <motion.div
            initial={{ x: 30, y: -10, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, type: "spring", bounce: 0.5 }}
            className="absolute right-2 top-6 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/60 flex items-center gap-2.5 z-20"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <ArrowRight className="w-4 h-4 -rotate-45" strokeWidth={3} />
            </div>
            <div className="pr-2">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Growth</div>
              <div className="text-sm font-black text-slate-800 leading-none mt-0.5">+24%</div>
            </div>
          </motion.div>

          {/* Floating 3D Sphere */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [-5, 5, -5] }}
            transition={{ 
              scale: { duration: 0.5, delay: 0.4, type: "spring" },
              opacity: { duration: 0.5, delay: 0.4 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }
            }}
            className="absolute left-4 bottom-6 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 shadow-[0_8px_16px_rgba(99,102,241,0.4)] border border-white/20 z-20 flex items-center justify-center"
          >
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-white/40 to-transparent opacity-60"></div>
            <div className="w-4 h-4 bg-white/90 rounded-full shadow-inner"></div>
          </motion.div>

        </div>

        {/* Center: Content */}
        <div className="flex-1 flex flex-col items-start gap-3 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }} 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#334155] text-xs font-bold tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#334155]"></span>
            LEARNING
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }} 
            className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight"
          >
            Financial Wellness
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.4 }} 
            className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl"
          >
            Master your money mindset with our comprehensive guide to building sustainable wealth.
          </motion.p>
        </div>

        {/* Right: CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.5 }} 
          className="w-full md:w-auto shrink-0 flex justify-start md:justify-end md:pl-4 md:pr-2"
        >
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-[#2563EB] font-semibold text-lg hover:text-blue-800 transition-colors group whitespace-nowrap"
          >
            Know more
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </a>
        </motion.div>

      </motion.div>
    </div>
  );
}
