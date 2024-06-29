import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import NavbarDemo from "./navbar";
import Rating from "./rating/Rating";

type Review = {
  createdAt: string;
  academicRating: number;
  facultyRating: number;
  infrastructureRating: number;
  accommodationRating: number;
  socialLifeRating: number;
  feeRating: number;
  placementRating: number;
  foodRating: number;
};

type StarCounts = {
  [key: number]: number;
};

const fetchReviews = async (college: string): Promise<Review[]> => {
  const response = await fetch(`/api/getReviews/${college}`);
  const data = await response.json();
  return data.reviews;
};

import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const fetchCollegeInfo = async (college: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://www.google.com/search?q=${encodeURIComponent(college)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Example: Extract more detailed information from search results
    const results = Array.from(document.querySelectorAll('.BNeawe')); // Adjust based on actual HTML structure
    const detailedInfo = results.map((result) => result.textContent).join('\n');

    return detailedInfo;
  } catch (error) {
    console.error('Error fetching college info:', error);
    return null;
  }
};



const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;

  const totalRatings = reviews.reduce((acc, review) => {
    const totalReviewRating = review.academicRating +
      review.facultyRating +
      review.infrastructureRating +
      review.accommodationRating +
      review.socialLifeRating +
      review.feeRating +
      review.placementRating +
      review.foodRating;
    return acc + totalReviewRating / 8; // Assuming equal weight for each category
  }, 0);

  return totalRatings / reviews.length;
};

const countStarRatings = (reviews: Review[], star: number): number => {
  return reviews.filter(review =>
    Math.round((review.academicRating +
      review.facultyRating +
      review.infrastructureRating +
      review.accommodationRating +
      review.socialLifeRating +
      review.feeRating +
      review.placementRating +
      review.foodRating) / 8) === star).length;
};

const View = ({ college }: { college: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<string>('academic');
  const [averageRating, setAverageRating] = useState<number>(0);
  const [starCounts, setStarCounts] = useState<StarCounts>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [collegeInfo, setCollegeInfo] = useState<string | null>(null);
  useEffect(() => {
    fetchReviews(college).then((reviews) => {
      setReviews(reviews);
      setAverageRating(calculateAverageRating(reviews));
      setStarCounts({
        5: countStarRatings(reviews, 5),
        4: countStarRatings(reviews, 4),
        3: countStarRatings(reviews, 3),
        2: countStarRatings(reviews, 2),
        1: countStarRatings(reviews, 1),
      });
    });
    fetchCollegeInfo(college).then((info) => {
      setCollegeInfo(info);
    });
  }, [college]);

  const renderReviews = (category: string) => {
    const filteredReviews = reviews.filter((review) => review[`${category}Rating`] !== undefined);

    if (filteredReviews.length === 0) {
      return <p className="text-xl text-center mt-4 dark:text-gray-200">Be the first to review the college.</p>;
    }

    return filteredReviews.map((review, index) => {
      const reviewDate = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });

      return (
        <div key={index} className="mb-4 p-4 bg-gray-100 dark:bg-zinc-700 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Anonymous</p>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{reviewDate}</span>
          </div>
          <Rating isEditable={false} rating={review[`${category}Rating`]} setRating={() => {}} />
          <p className="mt-2 text-gray-800 dark:text-gray-200">{review[`${category}Review`]}</p>
        </div>
      );
    });
  };

  const renderStarRatingBar = (star: number) => {
    const count = starCounts[star];
    const percentage = (count / reviews.length) * 100;

    return (
      <div className="flex items-center mb-2" key={star}>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{star} ⭐</p>
        <div className="w-2/3 h-3 bg-gray-300 dark:bg-zinc-600 rounded-lg mx-2">
          <div
            className="h-3 bg-blue-600 dark:bg-blue-400 rounded-lg"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">( {percentage }% )</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-2 bg-zinc-50 dark:bg-zinc-900">
      <NavbarDemo />
      <div className="w-full max-w-5xl mt-32 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">{college}</h1>
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8">
          <div className="flex flex-row  justify-around items-center">
          <div className="flex flex-col  justify-between items-center mb-6">
            <div className="flex flex-col items-center mb-4 sm:mb-0">
              <div className="flex flex-row justify-around">
              <p className="text-3xl pr-4 -mt-1.5 font-semibold text-gray-800 dark:text-gray-200">{averageRating.toFixed(1)}</p>
              <Rating isEditable={false} rating={averageRating} setRating={() => {}} />
              </div>
            <p className="text-gray-800 dark:text-gray-200">{reviews.length} reviews</p>
            </div>
          </div>

          <div className="w-full max-w-xs mb-6">
            {[5, 4, 3, 2, 1].map(star => renderStarRatingBar(star))}
          </div>
          </div>

          <div className="mt-8 space-x-2 flex flex-wrap">
            {['academic', 'faculty', 'infrastructure', 'accommodation', 'socialLife', 'fee', 'placement', 'food'].map((category) => (
              <button
                key={category}
                className={`py-2 px-4 rounded-md mb-2 ${
                  activeTab === category
                    ? 'bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 text-white'
                    : 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200'
                }`}
                onClick={() => setActiveTab(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reviews
            </h2>
            {renderReviews(activeTab)}
          </div>

          

          <div className="mt-8">
          {collegeInfo && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">About {college}</h2>
              <p className="text-gray-800 dark:text-gray-200">{collegeInfo}</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
