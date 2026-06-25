/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Flame, BookOpen, Scale, HelpCircle } from "lucide-react";
import GachaSimulator from "./components/GachaSimulator";
import RoastArena from "./components/RoastArena";
import MemeCollection from "./components/MemeCollection";

type TabId = "gacha" | "roast" | "memes";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("gacha");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Top Banner & Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl border border-violet-500/20 shadow-lg shadow-indigo-950/40">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Anime Salt Simulator
              </h1>
              <p className="text-[11px] text-slate-400">
                A comedic gacha luck calculator and AI-powered taste critique arena
              </p>
            </div>
          </div>

          {/* Comedic Header Badge */}
          <div className="flex items-center gap-1.5 text-xs font-mono bg-violet-950/25 text-violet-400 border border-violet-900/30 px-3 py-1 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span>Salinity Level: Seasoned</span>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-grow">
        
        {/* Tab Controls Navigation */}
        <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-slate-900 max-w-lg mb-8 mx-auto">
          <button
            onClick={() => setActiveTab("gacha")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "gacha"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salty Gacha</span>
          </button>
          <button
            onClick={() => setActiveTab("roast")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "roast"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Taste Roaster</span>
          </button>
          <button
            onClick={() => setActiveTab("memes")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "memes"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Salt Chronicles</span>
          </button>
        </div>

        {/* Tab Content Panels with Fade-in Motion Transitions */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {activeTab === "gacha" && <GachaSimulator />}
              {activeTab === "roast" && <RoastArena />}
              {activeTab === "memes" && <MemeCollection />}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Simple, Humble Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-[11px] text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p>
            Anime Salt Simulator is an entertainment app. Gacha simulation uses randomized mock odds.
          </p>
          <p className="text-slate-600">
            Powered by Gemini 3.5 Flash for witty, community-literate taste critique.
          </p>
        </div>
      </footer>
    </div>
  );
}
