import React, { useState } from "react";
import { motion } from "motion/react";
import { HeartOff, ShieldAlert, Clock, Sparkles, Quote, AlertCircle, Sparkle } from "lucide-react";
import { SALT_MEMES } from "../data";

export default function MemeCollection() {
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null);

  // Safely map icon string names to solid Lucide components
  const renderMemeIcon = (iconName: string) => {
    switch (iconName) {
      case "HeartBreak":
        return <HeartOff className="w-5 h-5 text-rose-400 shrink-0" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />;
      case "Clock":
        return <Clock className="w-5 h-5 text-indigo-400 shrink-0" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div id="meme-collection" className="space-y-6">
      <div className="border border-slate-850 bg-slate-900/30 p-4 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sparkle className="w-4 h-4 text-violet-400" />
          The Salt Chronicles
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          A historical record of the most legendary salt-inducing moments in anime and gacha gaming history. Select any chronicled event below to read its tragic testament.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side: Cards list */}
        <div className="space-y-3">
          {SALT_MEMES.map((meme) => {
            const isSelected = selectedMeme === meme.id;
            return (
              <button
                key={meme.id}
                onClick={() => setSelectedMeme(meme.id)}
                className={`w-full text-left border rounded-xl p-4 transition-all duration-250 flex items-start gap-3.5 relative overflow-hidden group ${
                  isSelected
                    ? "bg-gradient-to-r from-slate-900 to-slate-950 border-violet-500 shadow-md shadow-violet-950/20"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                {/* Visual active left bar */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                )}

                <div className={`p-2.5 rounded-xl border ${
                  isSelected ? "bg-slate-950 border-violet-500/30" : "bg-slate-950/60 border-slate-800"
                }`}>
                  {renderMemeIcon(meme.icon)}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-slate-100 transition-colors">
                    {meme.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal line-clamp-2">
                    {meme.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Expanded detail viewer */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[300px] relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {selectedMeme ? (() => {
            const current = SALT_MEMES.find((m) => m.id === selectedMeme);
            if (!current) return null;

            return (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-5 h-full flex flex-col justify-between relative z-10"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                      {renderMemeIcon(current.icon)}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded border border-violet-500/10">
                        Chronicled History
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">{current.title}</h4>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed border-t border-slate-900 pt-3.5">
                    {current.description}
                  </p>
                </div>

                {/* Relatable quote card */}
                <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl relative mt-4">
                  <Quote className="w-6 h-6 text-violet-500/15 absolute -top-1 -left-1" />
                  <p className="text-xs text-slate-300 italic font-mono leading-relaxed relative z-10 pl-4 border-l-2 border-violet-500/30">
                    "{current.quote}"
                  </p>
                </div>
              </motion.div>
            );
          })() : (
            <div className="my-auto text-center space-y-3.5 max-w-xs mx-auto relative z-10">
              <Quote className="w-10 h-10 text-slate-700 mx-auto animate-pulse" />
              <div>
                <h3 className="text-sm font-semibold text-slate-300">Select an Chronicle</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Click on any chronicled event on the left to review the deep feelings of salty gamers throughout anime history.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
