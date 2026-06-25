import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  ShieldAlert,
  Dumbbell,
  Lightbulb,
  Sparkles,
  Clipboard,
  Check,
  Send,
  User,
  Heart,
  MessageSquare,
  Scale,
  RefreshCw
} from "lucide-react";
import { RoastResponse } from "../types";
import { POPULAR_ANIME_PRESETS, CONTROVERSIAL_OPINIONS, WAIFU_HUSBANDO_PRESETS } from "../data";

export default function RoastArena() {
  const [favorites, setFavorites] = useState<string[]>(["", "", ""]);
  const [waifu, setWaifu] = useState("");
  const [opinion, setOpinion] = useState("");
  
  const [isRoasting, setIsRoasting] = useState(false);
  const [roastLogIndex, setRoastLogIndex] = useState(0);
  const [roastResult, setRoastResult] = useState<RoastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Funny logs shown sequentially during Gemini generation
  const ROAST_LOGS = [
    "Locating your questionable MyAnimeList profile...",
    "Scanning waifu attachment levels... Oh dear.",
    "Evaluating unpopular opinion for lethal copium content...",
    "Summoning the Council of 1990s Elitist Gatekeepers...",
    "Drafting appropriate level of online salt...",
    "Refining pure, unadulterated NaCl content..."
  ];

  const handleFavoriteChange = (index: number, val: string) => {
    const updated = [...favorites];
    updated[index] = val;
    setFavorites(updated);
  };

  const fillFavoritePreset = (animeName: string) => {
    // Find first empty slot, or replace the last one
    const updated = [...favorites];
    const emptyIdx = updated.findIndex(f => !f);
    if (emptyIdx !== -1) {
      updated[emptyIdx] = animeName;
    } else {
      updated[2] = animeName;
    }
    setFavorites(updated);
  };

  const handleRoast = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeFavorites = favorites.filter(Boolean);
    if (activeFavorites.length === 0) {
      setError("You must enter at least one favorite anime so we have something to roast!");
      return;
    }

    setIsRoasting(true);
    setError(null);
    setRoastResult(null);
    setRoastLogIndex(0);

    // Sequence through funny logs
    const logInterval = setInterval(() => {
      setRoastLogIndex(prev => {
        if (prev < ROAST_LOGS.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favorites: activeFavorites,
          unpopularOpinion: opinion,
          waifu: waifu,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate roast.");
      }

      const data = await response.json();
      setRoastResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. The salt mine collapsed!");
    } finally {
      clearInterval(logInterval);
      setIsRoasting(false);
    }
  };

  const copyToClipboard = () => {
    if (!roastResult) return;
    const shareText = `--- MY SALTY ANIME ROAST ---
Archetype: ${roastResult.funnyTitle}
Saltiness Level: ${roastResult.saltinessRating}% NaCl

[The Roast]:
"${roastResult.roast}"

[Diagnoses]:
${roastResult.diagnoses.map(d => `- ${d}`).join("\n")}

[Recommended Remedy]:
${roastResult.suggestedRemedies.map(r => `- ${r}`).join("\n")}
`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearForm = () => {
    setFavorites(["", "", ""]);
    setWaifu("");
    setOpinion("");
    setRoastResult(null);
    setError(null);
  };

  return (
    <div id="roast-arena" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Inputs Form */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Anime Taste Submission
            </h3>
            <button
              onClick={clearForm}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800/40 hover:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700/50 transition-all"
            >
              Clear
            </button>
          </div>

          <form onSubmit={handleRoast} className="space-y-4">
            {/* Top 3 Favorites */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Top 3 Favorite Anime <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {favorites.map((fav, i) => (
                  <div key={i} className="relative flex items-center">
                    <span className="absolute left-3 text-[10px] font-mono text-slate-500 font-bold">
                      #{i + 1}
                    </span>
                    <input
                      type="text"
                      placeholder={`Anime Name (e.g. ${POPULAR_ANIME_PRESETS[i]})`}
                      value={fav}
                      onChange={(e) => handleFavoriteChange(i, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/80 transition-colors"
                    />
                  </div>
                ))}
              </div>
              
              {/* Presets Grid for Favorites */}
              <div className="pt-1.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                  Popular Anime Presets
                </span>
                <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto pr-1">
                  {POPULAR_ANIME_PRESETS.map((p) => {
                    const isSelected = favorites.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => fillFavoritePreset(p)}
                        disabled={isSelected}
                        className={`text-[10px] px-2 py-1 rounded-md transition-all ${
                          isSelected
                            ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-transparent"
                            : "bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
                        }`}
                      >
                        + {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Waifu / Husbando */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10" />
                Favorite Waifu or Husbando (Optional)
              </label>
              <input
                type="text"
                placeholder="Name of your fictional darling..."
                value={waifu}
                onChange={(e) => setWaifu(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/80 transition-colors"
              />
              <div className="flex flex-wrap gap-1">
                {WAIFU_HUSBANDO_PRESETS.slice(0, 4).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWaifu(w)}
                    className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Controversial Opinion */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Unpopular Anime Opinion (Optional)
              </label>
              <textarea
                placeholder="Tell us what opinion gets you kicked out of Discord servers..."
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/80 transition-colors resize-none"
              />
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-semibold uppercase block">
                  Click to Use Unpopular Opinion Preset
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {CONTROVERSIAL_OPINIONS.slice(0, 3).map((op, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setOpinion(op)}
                      className="text-[10px] text-left bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 p-1.5 rounded-lg line-clamp-1 truncate"
                    >
                      "{op}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRoasting}
              className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-455 hover:to-orange-555 active:scale-[0.98] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-xl shadow-red-950/20 flex items-center justify-center gap-2 mt-2"
            >
              <Send className="w-4 h-4 text-orange-100" />
              <span>{isRoasting ? "ROASTING..." : "ROAST MY TASTE!"}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Roast Output Area */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[460px] relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* If Loading / Generating Roast */}
          {isRoasting && (
            <div className="my-auto space-y-6 text-center py-12 relative z-10">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold font-mono text-slate-300">SALT FACTORY ACTIVATED</h4>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roastLogIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-orange-400 font-mono h-4"
                  >
                    {ROAST_LOGS[roastLogIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* If Error */}
          {error && !isRoasting && (
            <div className="my-auto text-center space-y-3 max-w-sm mx-auto py-12 relative z-10 border border-red-900/30 bg-red-950/20 p-6 rounded-2xl">
              <ShieldAlert className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
              <h3 className="text-sm font-bold text-slate-200">Salt Overdose / API Error</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {error}
              </p>
              <button
                onClick={handleRoast}
                className="text-xs bg-red-900/40 hover:bg-red-900 text-red-200 px-3 py-1.5 rounded-lg border border-red-800/50 transition-colors"
              >
                Retry Roasting
              </button>
            </div>
          )}

          {/* If We Have a Generated Roast Response */}
          {roastResult && !isRoasting && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, type: "spring" }}
              className="space-y-5 h-full flex flex-col justify-between relative z-10"
            >
              {/* Header Profile Title card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                    Taste Diagnosis
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {roastResult.funnyTitle}
                  </h4>
                </div>

                {/* Salt rating circle or tag */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-xl">
                  <div className="w-8 h-8 rounded-full border-2 border-orange-500 flex items-center justify-center font-mono font-bold text-xs text-orange-400 bg-orange-950/20 shrink-0">
                    {roastResult.saltinessRating}%
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block font-mono">SALINITY</span>
                    <span className="text-[10px] text-orange-300 font-semibold font-mono">Pure NaCl</span>
                  </div>
                </div>
              </div>

              {/* The actual Roast Bubble */}
              <div className="bg-gradient-to-r from-orange-950/20 to-red-950/20 border border-orange-900/20 rounded-2xl p-5 relative">
                {/* Floating Quotes background mark */}
                <span className="absolute -top-3 -left-1 text-5xl font-serif text-orange-500/20 pointer-events-none">“</span>
                <p className="text-slate-200 text-sm md:text-sm leading-relaxed relative z-10 italic">
                  "{roastResult.roast}"
                </p>
              </div>

              {/* Grid of symptoms and cures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Diagnoses Panel */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Symptoms & Syndrome
                  </h5>
                  <ul className="space-y-1.5">
                    {roastResult.diagnoses.map((diag, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-red-400 text-xs shrink-0 mt-0.5">•</span>
                        <span>{diag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Remedies Panel */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Suggested Cure
                  </h5>
                  <ul className="space-y-1.5">
                    {roastResult.suggestedRemedies.map((rem, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-400 text-xs shrink-0 mt-0.5">•</span>
                        <span>{rem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-900">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2.5 border border-slate-800 rounded-xl transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Roast!
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" /> Copy Share Link
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* If Empty State */}
          {!roastResult && !isRoasting && !error && (
            <div className="my-auto text-center space-y-4 max-w-sm mx-auto py-12 relative z-10">
              <Scale className="w-12 h-12 text-slate-700 mx-auto animate-pulse" />
              <div>
                <h3 className="text-base font-semibold text-slate-300">Salty Roast Waiting</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Fill in your top favorite anime, your waifu choice, or that controversial opinion you defend in comment sections, then click "Roast My Taste!" to receive a highly detailed, AI-crafted roast of your taste.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
