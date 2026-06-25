export interface GachaItem {
  id: string;
  name: string;
  rarity: 3 | 4 | 5;
  type: "character" | "item" | "salt";
  description: string;
  quote: string;
  image: string; // Describes the illustration we will show or generate
  saltValue: number; // Grams of salt accumulated from pulling this
}

export interface PullStats {
  totalPulls: number;
  totalSpends: number; // Dollars wasted
  saltAccumulated: number; // Grams of NaCl
  sanity: number; // 0 to 100
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
}

export interface RoastResponse {
  roast: string;
  saltinessRating: number;
  funnyTitle: string;
  diagnoses: string[];
  suggestedRemedies: string[];
}

export interface SavedMeme {
  id: string;
  title: string;
  description: string;
  quote: string;
  icon: string;
}
