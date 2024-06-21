import { KeyboardEvent, useEffect, useState } from 'react';
import styles from './Rating.module.css';
import { RatingProps } from './Rating.props';
import Star from './Star';

const Rating = ({
  isEditable = false,
  rating,
  setRating,
  className,
  ...props
}: RatingProps): JSX.Element => {
  const [ratingArray, setRatingArray] = useState<JSX.Element[]>(new Array(5).fill(<></>));

  const constructRating = (currentRating: number) => {
    const updatedArray = ratingArray.map((_, idx: number) => {
      const isFilled = idx < Math.floor(currentRating);
      const isHalfFilled = !isFilled && idx < currentRating;

      return (
        <Star
          isFilled={isFilled}
          isHalfFilled={isHalfFilled}
          key={idx}
          onMouseEnter={() => hoverHandle(idx + 1)}
          onMouseLeave={() => hoverHandle(rating)}
          onClick={() => clickHandle(idx + 1)}
          className={isEditable ? styles.editable : ''}
          tabIndex={isEditable ? 0 : -1}
          onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => handleKeyDown(e, idx + 1)}
        />
      );
    });
    setRatingArray(updatedArray);
  };

  const hoverHandle = (idx: number) => {
    if (!isEditable) {
      return;
    }
    constructRating(idx);
  };

  const clickHandle = (idx: number) => {
    if (!isEditable || !setRating) {
      return;
    }
    setRating(idx);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>, idx: number) => {
    if (!isEditable || !setRating) {
      return;
    }
    if (e.code === 'Space') {
      setRating(idx);
    }
  };

  useEffect(() => {
    constructRating(rating);
  }, [rating]);

  return (
    <div className={`${styles.rating} ${className || ''}`} {...props}>
      {ratingArray.map((r, idx) => (
        <span key={idx}>{r}</span>
      ))}
    </div>
  );
};

export default Rating;
