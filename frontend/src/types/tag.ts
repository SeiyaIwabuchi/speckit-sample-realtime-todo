export const COLOR_PALETTE = {
  RED: '#EF4444',
  ORANGE: '#F97316',
  YELLOW: '#EAB308',
  GREEN: '#22C55E',
  TEAL: '#14B8A6',
  BLUE: '#3B82F6',
  INDIGO: '#6366F1',
  PURPLE: '#A855F7',
  PINK: '#EC4899',
  GRAY: '#6B7280'
} as const;

export type TagColor = typeof COLOR_PALETTE[keyof typeof COLOR_PALETTE];

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
  createdAt: Date;
  userId: string;
}