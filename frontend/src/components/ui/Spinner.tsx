import React from "react";

/**
 * 汎用ローディングスピナー
 * TailwindCSSでアニメーション
 * サイズ・色はpropsで調整可能
 */
export type SpinnerProps = {
  size?: number; // px
  color?: string; // TailwindCSSカラー
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({
  size = 32,
  color = "text-blue-500",
  className = "",
}) => (
  <div
    className={`flex items-center justify-center ${className}`}
    role="status"
    aria-label="読み込み中"
  >
    <svg
      className={`animate-spin ${color}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
);

export default Spinner;
