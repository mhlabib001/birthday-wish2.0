export interface BirthdayCaption {
  id: string;
  category: 'emotional' | 'sweet' | 'poetic' | 'inspirational' | 'lifeline';
  title: string;
  text: string;
  englishTranslation?: string;
  authorTag?: string;
  emoji: string;
}

export interface CandleState {
  id: number;
  isLit: boolean;
  captionRevealed?: BirthdayCaption;
}

export interface LifelineCard {
  id: number;
  title: string;
  description: string;
  badge: string;
  iconName: string;
  color: string;
}

export interface Balloon {
  id: number;
  color: string;
  x: number; // percentage
  speed: number;
  message: string;
  popped: boolean;
}
