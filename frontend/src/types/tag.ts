
// タグ用カラーパレット（10色）
export const COLOR_PALETTE = [
  '#EF4444', // 赤
  '#F97316', // オレンジ
  '#EAB308', // 黄
  '#22C55E', // 緑
  '#14B8A6', // ティール
  '#3B82F6', // 青
  '#6366F1', // インディゴ
  '#A855F7', // 紫
  '#EC4899', // ピンク
  '#6B7280', // グレー
];

export type TagColor = string;

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
  createdAt: Date;
  userId: string;
}