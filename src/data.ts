import { GachaItem, SavedMeme } from "./types";

export const GACHA_ITEMS: GachaItem[] = [
  // 5-Star Items (Low rate, ultimate pride or absolute salt-ruiners)
  {
    id: "waifu_99",
    name: "Ultimate Maid Waifu (S-Tier)",
    rarity: 5,
    type: "character",
    description: "Equipped with pristine apron and a 0.0001% drop rate. Only loves you if you have 800 pull-history or a platinum credit card.",
    quote: "Welcome home, Master! Please ignore the massive invoice from the gacha company.",
    image: "maid_waifu",
    saltValue: 0,
  },
  {
    id: "edgelord_99",
    name: "God-Tier OP Dark Edgelord",
    rarity: 5,
    type: "character",
    description: "Has dual-wielding katanas, a black cloak with glowing red runes, and 70 lines of tragic backstory. Unbelievably strong, completely silent.",
    quote: "The shadows whisper... of your credit card limit.",
    image: "dark_edgelord",
    saltValue: 0,
  },
  {
    id: "ruiner_99",
    name: "The 50/50 Ruiner (Zombie Kid)",
    rarity: 5,
    type: "character",
    description: "The absolute terror of gacha gamers. Appears exactly when you are at 89 pity, ruining your chance at the limited banner character.",
    quote: "Did you want the limited-edition dragon god? Too bad! Here is a duplicate of me!",
    image: "zombie_kid",
    saltValue: 180, // High salt accumulation!
  },

  // 4-Star Items (Relatively good but common)
  {
    id: "tsundere_01",
    name: "Tsundere Childhood Friend",
    rarity: 4,
    type: "character",
    description: "Prone to blushing, calling you a 'baka', and throwing heavy objects when embarrassed. Has excellent defense stats.",
    quote: "I-It's not like I wanted to be pulled by you! B-Baka!",
    image: "tsundere_girl",
    saltValue: 5,
  },
  {
    id: "broken_support",
    name: "Overpowered Support Chef",
    rarity: 4,
    type: "character",
    description: "Dressed in an ordinary chef uniform, but actually buffs your entire party's damage by 300%. Far more useful than most 5-stars.",
    quote: "A pinch of salt makes any pull better!",
    image: "support_chef",
    saltValue: 2,
  },
  {
    id: "chuuni_01",
    name: "Chuunibyou Dark Mage",
    rarity: 4,
    type: "character",
    description: "Wears an eye patch over a perfectly normal eye. Constantly mutters about the 'unleashed seal' and ancient dragons in their arm.",
    quote: "Tremble before the dark flame of my right arm... which hurts when it rains!",
    image: "chuuni_mage",
    saltValue: 6,
  },
  {
    id: "annoying_mascot",
    name: "Emergency Food Mascot",
    rarity: 4,
    type: "character",
    description: "Floats around, eats all your premium ingredients, talks in the third person, and has zero combat capability.",
    quote: "Hey! Why are you looking at me with salt in your eyes?",
    image: "emergency_mascot",
    saltValue: 25, // Annoyance adds salt!
  },

  // 3-Star Items (90% of the pools, pure salt content)
  {
    id: "salt_shaker",
    name: "Premium Table Salt Shaker",
    rarity: 3,
    type: "salt",
    description: "A beautifully polished shaker filled with 100% genuine player tears. Highly effective at raising blood pressure.",
    quote: "Season your pulls to perfection.",
    image: "salt_shaker",
    saltValue: 15,
  },
  {
    id: "debate_club",
    name: "Spammy Wooden Debate Club",
    rarity: 3,
    type: "item",
    description: "You currently have 8,924 of these in your inventory. Good for heating a fire, bad for fighting gods.",
    quote: "Bonk! Another 3-star for you.",
    image: "debate_club",
    saltValue: 10,
  },
  {
    id: "tear_vial",
    name: "Flask of Distilled Player Tears",
    rarity: 3,
    type: "salt",
    description: "Liquid gold, if gold was made of concentrated regret and broken gacha dreams.",
    quote: "Slurps... tastes like a lost 50/50.",
    image: "tear_vial",
    saltValue: 20,
  },
  {
    id: "empty_capsule",
    name: "Disappointing Empty Capsule",
    rarity: 3,
    type: "item",
    description: "A shiny plastic ball. You open it expecting a legendary weapon, but it contains only air and a note saying 'Try Again'.",
    quote: "Gacha is a journey, not a destination.",
    image: "empty_capsule",
    saltValue: 12,
  },
  {
    id: "cabbage_junk",
    name: "Common Green Cabbage",
    rarity: 3,
    type: "item",
    description: "Just a head of cabbage. Why is this in a weapon portal? Nobody knows, but the mascot chef looks pleased.",
    quote: "At least it's healthy!",
    image: "cabbage",
    saltValue: 8,
  }
];

export const CONTROVERSIAL_OPINIONS = [
  "Sword Art Online is an absolute masterpiece.",
  "Demon Slayer is just beautiful animation carrying a boring story.",
  "Subtitles are overrated; Dubbed anime is superior in every way.",
  "Classic 90s anime is slow, boring, and has terrible pacing.",
  "I skip every single anime intro and outro theme without exception.",
  "Filler episodes are actually the best part of long-running shonen."
];

export const POPULAR_ANIME_PRESETS = [
  "Naruto",
  "One Piece",
  "Attack on Titan",
  "My Hero Academia",
  "Death Note",
  "Neon Genesis Evangelion",
  "Jujutsu Kaisen",
  "Frieren: Beyond Journey's End",
  "Hunter x Hunter",
  "Steins;Gate",
  "Bleach",
  "Fullmetal Alchemist: Brotherhood"
];

export const WAIFU_HUSBANDO_PRESETS = [
  "Speedwagon (JoJo)",
  "Rem (Re:Zero)",
  "Zero Two (Darling in the Franxx)",
  "Satoru Gojo (Jujutsu Kaisen)",
  "Megumin (Konosuba)",
  "Lelouch vi Britannia (Code Geass)",
  "Marin Kitagawa (My Dress-Up Darling)",
  "Mikasa Ackerman (Attack on Titan)"
];

export const SALT_MEMES: SavedMeme[] = [
  {
    id: "meme_5050",
    title: "The 50/50 Heartbreak",
    description: "Losing a limited character roll to a standard duplicate zombie kid or healer at 90 pulls.",
    quote: "I saved for 4 months just to get a standard dupe...",
    icon: "HeartBreak"
  },
  {
    id: "meme_flatstats",
    title: "Flat Stat Ruined Artifact",
    description: "Getting a legendary artifact with Crit Rate and Crit Damage, only for all upgrades to roll into flat Defense.",
    quote: "My level 20 feather has +94 Defense! Yay...",
    icon: "ShieldAlert"
  },
  {
    id: "meme_maintenance",
    title: "Maintenance Extension Pain",
    description: "Waiting all day for the game update to complete, only for the developer to announce a 4-hour extension.",
    quote: "Apologems incoming! (But it's only 60 gems, which is 1/3 of a single pull)",
    icon: "Clock"
  },
  {
    id: "meme_unlucky_10",
    title: "The 'All-Purple' 10-Pull",
    description: "Doing a multi-pull and seeing only the bare minimum guaranteed 4-star weapon and nine 3-star cabbages.",
    quote: "The sky turned purple... and my soul turned black.",
    icon: "Sparkles"
  }
];
