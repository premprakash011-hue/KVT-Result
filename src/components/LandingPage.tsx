import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BrainCircuit, BarChart3, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-[#0a0a0a]/10">
        <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
          <div className="w-8 h-8 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white">
            <GraduationCap size={18} />
          </div>
          <span>ResultAI</span>
        </div>
        <div className="flex gap-8 text-sm font-medium uppercase tracking-widest opacity-60">
          <a href="#" className="hover:opacity-100 transition-opacity">Features</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Methodology</a>
          <a href="#" className="hover:opacity-100 transition-opacity">About</a>
        </div>
        <Button variant="outline" className="rounded-full border-[#0a0a0a] px-6 uppercase text-xs tracking-widest font-bold" onClick={onStart}>
          Get Started
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        <div className="flex flex-col justify-center p-12 lg:p-24 border-r border-[#0a0a0a]/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-40 mb-6 block">
              Advanced Academic Intelligence
            </span>
            <h1 className="text-7xl lg:text-8xl font-semibold leading-[0.85] tracking-tighter mb-8">
              Class XI <br />
              <span className="italic font-light">Result</span> <br />
              Analysis.
            </h1>
            <p className="text-xl opacity-60 max-w-md mb-12 leading-relaxed">
              Leveraging state-of-the-art Neural Networks to extract, calculate, and visualize student performance with surgical precision.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="rounded-full bg-[#0a0a0a] text-white px-8 h-14 uppercase text-xs tracking-widest font-bold hover:scale-105 transition-transform" onClick={onStart}>
                Analyze Results
              </Button>
              <div className="w-14 h-14 rounded-full border border-[#0a0a0a]/20 flex items-center justify-center hover:bg-white transition-colors cursor-pointer">
                <BrainCircuit size={20} />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative bg-[#0a0a0a] overflow-hidden hidden lg:block">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#ffffff_1px,_transparent_1px)] bg-[length:40px_40px]" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-[400px] h-[400px] border border-white/20 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-[300px] h-[300px] border border-white/40 rounded-full flex items-center justify-center">
                <div className="w-[200px] h-[200px] border border-white/60 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-12 left-12 right-12">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-white/40">
                <BarChart3 size={24} className="mb-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Real-time</h3>
                <p className="text-[10px] leading-tight opacity-60 uppercase tracking-wider">Instant percentage calculation and grading.</p>
              </div>
              <div className="text-white/40">
                <Upload size={24} className="mb-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Multi-format</h3>
                <p className="text-[10px] leading-tight opacity-60 uppercase tracking-wider">Upload images, CSVs, or raw text data.</p>
              </div>
              <div className="text-white/40">
                <BrainCircuit size={24} className="mb-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Neural</h3>
                <p className="text-[10px] leading-tight opacity-60 uppercase tracking-wider">Powered by Gemini for intelligent extraction.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-[#0a0a0a]/10 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
          © 2026 ResultAI Systems. All Rights Reserved.
        </div>
        <div className="flex gap-12 text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Github</a>
        </div>
      </footer>
    </div>
  );
};
