import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coins, Sparkles, AlertTriangle, RefreshCw, Eye, Scale, Smile, Meh, Frown, Flame } from "lucide-react";
import { GachaItem, PullStats } from "../types";
import { GACHA_ITEMS } from "../data";

export default function GachaSimulator() {
  const [stats, setStats] = useState<PullStats>({
    totalPulls: 0,
    totalSpends: 0,
    saltAccumulated: 0,
    sanity: 100,
    fiveStarCount: 0,
    fourStarCount: 0,
    threeStarCount: 0,
  });

  const [pulledItems, setPulledItems] = useState<GachaItem[]>([]);
  const [isPulling, setIsPulling] = useState(false);
  const [showRarityReveal, setShowRarityReveal] = useState<3 | 4 | 5 | null>(null);

  // Performs a single pull following standard rates
  // 5-Star: 1.6% (boosted for fun!), 4-Star: 12%, 3-Star: 86.4%
  const getRandomItem = (pityCounter: number): GachaItem => {
    const roll = Math.random() * 100;
    let selectedRarity: 3 | 4 | 5 = 3;

    // Soft pity or standard luck
    if (roll < 2.5 || pityCounter >= 80) {
      selectedRarity = 5;
    } else if (roll < 15) {
      selectedRarity = 4;
    } else {
      selectedRarity = 3;
    }

    const pool = GACHA_ITEMS.filter((item) => item.rarity === selectedRarity);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handlePull = (count: number) => {
    if (isPulling) return;
    setIsPulling(true);
    setPulledItems([]);

    // Determine highest rarity in this pull for screen flash effect
    let highestRarity: 3 | 4 | 5 = 3;
    const newPulls: GachaItem[] = [];

    for (let i = 0; i < count; i++) {
      const item = getRandomItem(stats.totalPulls % 90 + i);
      newPulls.push(item);
      if (item.rarity > highestRarity) {
        highestRarity = item.rarity;
      }
    }

    // Trigger reveal flash animation
    setShowRarityReveal(highestRarity);

    setTimeout(() => {
      setShowRarityReveal(null);
      setPulledItems(newPulls);

      // Calculate statistics
      let saltGained = 0;
      let fives = 0;
      let fours = 0;
      let threes = 0;

      newPulls.forEach((item) => {
        saltGained += item.saltValue;
        if (item.rarity === 5) fives++;
        else if (item.rarity === 4) fours++;
        else if (item.rarity === 3) threes++;
      });

      setStats((prev) => {
        const nextPulls = prev.totalPulls + count;
        const nextSpends = prev.totalSpends + count * 2.5; // $2.50 per pull
        const nextSalt = prev.saltAccumulated + saltGained;

        // Sanity decreases based on 3-star pulls, recovers slightly on 5-star pulls
        let sanityChange = -(threes * 3.5) - (fours * 0.5) + (fives * 25);
        let nextSanity = Math.max(0, Math.min(100, Math.round(prev.sanity + sanityChange)));

        return {
          totalPulls: nextPulls,
          totalSpends: nextSpends,
          saltAccumulated: nextSalt,
          sanity: nextSanity,
          fiveStarCount: prev.fiveStarCount + fives,
          fourStarCount: prev.fourStarCount + fours,
          threeStarCount: prev.threeStarCount + threes,
        };
      });

      setIsPulling(false);
    }, 850);
  };

  const resetSimulator = () => {
    setStats({
      totalPulls: 0,
      totalSpends: 0,
      saltAccumulated: 0,
      sanity: 100,
      fiveStarCount: 0,
      fourStarCount: 0,
      threeStarCount: 0,
    });
    setPulledItems([]);
  };

  // Helper to determine sanity mood and color
  const getSanityState = (sanity: number) => {
    if (sanity > 75) {
      return {
        label: "Stable Weeb",
        color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/30",
        icon: <Smile className="w-4 h-4 text-emerald-400" />,
        desc: "Full of hope and dreams. Cluelessly believing you will get a 5-star on the first pull.",
      };
    } else if (sanity > 45) {
      return {
        label: "Copium Inhaling",
        color: "text-amber-400 bg-amber-950/40 border-amber-800/30",
        icon: <Meh className="w-4 h-4 text-amber-400" />,
        desc: "Inhaling heavy quantities of Copium. Muttering 'the next ten-pull is guaranteed' under your breath.",
      };
    } else if (sanity > 15) {
      return {
        label: "Salty Despair",
        color: "text-orange-400 bg-orange-950/40 border-orange-800/30",
        icon: <Frown className="w-4 h-4 text-orange-400" />,
        desc: "Lamenting your life choices. Thinking of selling an organ to fund the pity system.",
      };
    } else {
      return {
        label: "Salt-Induced Melt Down",
        color: "text-rose-500 bg-rose-950/40 border-rose-950/60 animate-pulse border-rose-900/40",
        icon: <Flame className="w-4 h-4 text-rose-500" />,
        desc: "Critical salt overdose. Threatening to delete the game and write a 1,000-word negative Steam review.",
      };
    }
  };

  const sanityInfo = getSanityState(stats.sanity);

  return (
    <div id="gacha-simulator" className="space-y-6">
      {/* Simulation Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistics Panel (Sidebar) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Scale className="w-4 h-4 text-violet-400" />
              Salty Statistics
            </h3>
            <button
              onClick={resetSimulator}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors border border-slate-700/50"
              title="Reset stats"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3">
              <span className="text-xs text-slate-400 block mb-1">Total Pulls</span>
              <span className="text-xl font-mono font-semibold text-white">{stats.totalPulls}</span>
            </div>
            <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3">
              <span className="text-xs text-slate-400 block mb-1">Fake Cash Wasted</span>
              <span className="text-xl font-mono font-semibold text-amber-400 flex items-center gap-1">
                <Coins className="w-4 h-4" />
                ${stats.totalSpends.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Salt Level Meter */}
          <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Salt Accumulation (NaCl)</span>
              <span className="text-sm font-mono font-bold text-violet-300">{stats.saltAccumulated}g</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800/80">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, stats.saltAccumulated / 4)}%` }} // Scaled
                transition={{ type: "spring", stiffness: 60 }}
              />
            </div>
            <p className="text-[10px] text-slate-500 italic text-center">
              *Average human can tolerate 3g. You are currently {stats.saltAccumulated > 100 ? "clinically preserved." : "highly seasoned."}
            </p>
          </div>

          {/* Sanity Meter */}
          <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Sanity Level</span>
              <span className={`text-sm font-mono font-bold ${stats.sanity > 50 ? "text-emerald-400" : stats.sanity > 20 ? "text-amber-400" : "text-rose-500"}`}>
                {stats.sanity}%
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800/80">
              <motion.div
                className={`h-full ${stats.sanity > 50 ? "bg-emerald-500" : stats.sanity > 20 ? "bg-amber-500" : "bg-rose-500"}`}
                animate={{ width: `${stats.sanity}%` }}
                transition={{ type: "spring", stiffness: 60 }}
              />
            </div>
            <div className={`p-2.5 rounded-lg border text-xs ${sanityInfo.color} flex flex-col gap-1 mt-2`}>
              <div className="flex items-center gap-1.5 font-semibold">
                {sanityInfo.icon}
                <span>{sanityInfo.label}</span>
              </div>
              <span className="text-slate-300 leading-relaxed text-[11px]">{sanityInfo.desc}</span>
            </div>
          </div>

          {/* Loot Stats Breakdown */}
          <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400">Rarity Counters</h4>
            <div className="space-y-1.5 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-amber-400">★ ★ ★ ★ ★ (5-Star)</span>
                <span>{stats.fiveStarCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">★ ★ ★ ★ (4-Star)</span>
                <span>{stats.fourStarCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">★ ★ ★ (3-Star Junk)</span>
                <span>{stats.threeStarCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action and Pull Output Panel */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[460px] relative overflow-hidden shadow-2xl">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Pulling Rarity Reveal Flash Screen Overlay */}
          <AnimatePresence>
            {showRarityReveal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
              >
                {/* Glowing flash colors based on highest rarity */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 opacity-60 ${
                    showRarityReveal === 5
                      ? "bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600"
                      : showRarityReveal === 4
                      ? "bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600"
                      : "bg-slate-800"
                  }`}
                />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="z-30 text-center px-4"
                >
                  <Sparkles
                    className={`w-16 h-16 mx-auto mb-3 animate-spin ${
                      showRarityReveal === 5 ? "text-yellow-200" : showRarityReveal === 4 ? "text-purple-200" : "text-slate-300"
                    }`}
                  />
                  <h3 className="text-2xl font-bold font-sans text-white uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {showRarityReveal === 5 ? "🌟 GOLDEN 5-STAR REVEAL! 🌟" : showRarityReveal === 4 ? "✨ 4-STAR REVEAL! ✨" : "💨 3-STAR SALTY JUNK... 💨"}
                  </h3>
                  <p className="text-slate-100 text-xs mt-1 font-mono drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    {showRarityReveal === 5 ? "Prepare to touch grass!" : "Could be worse... but could be a duplicate!"}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Banner visual decoration */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono bg-violet-500/20 text-violet-400 border border-violet-500/30 px-1.5 py-0.5 rounded">
                  Limited Rate-Up Banner
                </span>
                <span className="text-xs text-slate-400 font-mono">Pity: {stats.totalPulls % 90}/90</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">Ethereal Tears of Salt Gacha Portal</h2>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Featured 5-star Maid Waifu and 4-star Tsundere rate-up! 3-star trash is heavily seasoned.
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0 bg-slate-950/80 p-2 border border-slate-800/80 rounded-lg text-xs font-mono text-slate-300">
              <span className="text-amber-400">5★ (1.6%)</span>
              <span className="text-slate-600">|</span>
              <span className="text-purple-400">4★ (12%)</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">3★ (86%)</span>
            </div>
          </div>

          {/* Pulled Items Grid */}
          <div className="my-6 min-h-[220px] flex items-center justify-center relative z-10">
            {isPulling ? (
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-mono text-slate-400 animate-pulse">Pulling fate threads from the salt mines...</p>
              </div>
            ) : pulledItems.length > 0 ? (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {pulledItems.map((item, index) => {
                    const isFive = item.rarity === 5;
                    const isFour = item.rarity === 4;

                    return (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ scale: 0.7, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.05, type: "spring", stiffness: 100 }}
                        className={`group relative border rounded-xl p-2.5 flex flex-col justify-between items-center text-center transition-shadow min-h-[145px] ${
                          isFive
                            ? "bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                            : isFour
                            ? "bg-gradient-to-b from-purple-950/30 to-slate-900 border-purple-500/80 shadow-[0_0_8px_rgba(168,85,247,0.15)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                        }`}
                      >
                        {/* Little top indicator */}
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                            isFive
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                              : isFour
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {item.rarity}★ {item.type === "salt" ? "SALT" : item.type}
                        </span>

                        {/* Middle portrait text description */}
                        <div className="my-2 space-y-1">
                          <h4 className={`text-xs font-bold leading-tight line-clamp-2 ${isFive ? "text-amber-300" : isFour ? "text-purple-300" : "text-slate-200"}`}>
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 line-clamp-1 italic italic">
                            "{item.quote}"
                          </span>
                        </div>

                        {/* Salt indicator if positive */}
                        <div className="flex items-center gap-1 mt-1 text-[10px] shrink-0">
                          {item.saltValue > 0 ? (
                            <span className="text-violet-400 font-mono flex items-center gap-0.5 font-semibold bg-violet-950/30 border border-violet-900/30 px-1.5 py-0.2 rounded-full">
                              +{item.saltValue}g Salt
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-mono font-semibold bg-emerald-950/30 border border-emerald-900/30 px-1.5 py-0.2 rounded-full">
                              0% Salt
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3.5 max-w-sm">
                <Sparkles className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                <div>
                  <h3 className="text-base font-semibold text-slate-300">Nothing Pulled Yet</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Will you be blessed with the legendary maid waifu, or will you suffer the ultimate zombie-spawn ruins? Press a pull button below to test your luck!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Simulation Controllers */}
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 border-t border-slate-900 pt-4">
            <button
              onClick={() => handlePull(1)}
              disabled={isPulling}
              className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 active:scale-[0.98] disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all border border-slate-700 shadow-lg flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-slate-300" />
              <span>Perform Single Pull</span>
              <span className="text-[11px] font-mono opacity-80 text-amber-400">($2.50)</span>
            </button>
            <button
              onClick={() => handlePull(10)}
              disabled={isPulling}
              className="flex-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:from-violet-555 hover:to-indigo-650 active:scale-[0.98] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all border border-violet-500 shadow-xl shadow-indigo-950/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-violet-200" />
              <span>Perform 10-Pull</span>
              <span className="text-[11px] font-mono opacity-80 text-amber-300">($25.00)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
