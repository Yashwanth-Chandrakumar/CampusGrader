// components/rating/Star.tsx
import React from 'react';
import styles from './Star.module.css';

interface StarProps {
  isFilled: boolean;
  isHalfFilled: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  className?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
}

const Star = ({
  isFilled,
  isHalfFilled,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
  tabIndex,
  onKeyDown,
}: StarProps): JSX.Element => {
  return (
    <span
      className={`${styles.star} ${className || ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFilled ? 'gold' : isHalfFilled ? 'url(#halfGradient)' : 'lightgray'}

        className={styles.starSvg}
      >
        <defs>
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="gold" />
            <stop offset="50%" stopColor="lightgray" />
          </linearGradient>
        </defs>
        <path d="M12 .587l3.668 7.431 8.2 1.191-5.917 5.767 1.398 8.148L12 18.897l-7.349 3.868 1.398-8.148-5.917-5.767 8.2-1.191z" />
      </svg>
    </span>
  );
};

export default Star;
