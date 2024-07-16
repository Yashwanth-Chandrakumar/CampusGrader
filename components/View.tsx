import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import NavbarDemo from "./navbar";
import Rating from "./rating/Rating";
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
type Review = {
  createdAt: string;
  verified:boolean;
  academicRating: number;
  academicReview: string;
  facultyRating: number;
  facultyReview: string;
  infrastructureRating: number;
  infrastructureReview: string;
  accommodationRating: number;
  accommodationReview: string;
  socialLifeRating: number;
  socialLifeReview: string;
  feeRating: number;
  feeReview: string;
  placementRating: number;
  placementReview: string;
  foodRating: number;
  foodReview: string;
};

type StarCounts = {
  [key: number]: number;
};

const fetchReviews = async (college: string): Promise<Review[]> => {
  const response = await fetch(`/api/getReviews/${college}`);
  const data = await response.json();
  return data.reviews;
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
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

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
    const fetchCollegeInfo = async () => {
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [
                {text: "give a general overview info on Sri krishna college of technology, please reply like newspaper, no intro be direct. do not give info that you are completely sure for example if you do not know the contact details dont give it.\n"},
              ],
            },
            {
              role: "model",
              parts: [
                {text: "Sri Krishna College of Technology (SKCT) is a prominent engineering college located in Coimbatore, Tamil Nadu, India. Established in 2001, the college offers a range of undergraduate and postgraduate programs in various engineering disciplines. SKCT is known for its well-equipped infrastructure, including laboratories, a spacious library, and modern classrooms. The college boasts a team of experienced faculty members dedicated to providing quality education. SKCT has strong industry collaborations, offering students valuable practical exposure and placement opportunities. The institution actively promotes research and innovation with dedicated research centers and facilities. SKCT emphasizes holistic development, including extracurricular activities, sports, and cultural events. The college has a commendable placement record with leading companies visiting the campus for recruitment. \n"},
              ],
            },
          ],
        });

        const result = await chat.sendMessage(`give a general complete overview info on ${college}, please reply like newspaper, no intro or title be direct. do not give info that you are completely sure for example if you do not know the contact details dont give it. Give as separate paragraphs and not as single block of text`);
        const response = result.response;
        setCollegeInfo(response.text());
      } catch (error) {
        console.error('Error fetching college info:', error);
        setCollegeInfo(null);
      }
    };

    fetchCollegeInfo();
  }, [college]);
  const formatCollegeInfo = (text: string): JSX.Element[] => {
    const lines = text.split('\n\n'); // Split into paragraphs
  
    return lines.map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        // Handle headings
        const headingText = paragraph.replace('## ', '');
        return (
          <h2 key={index} className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {headingText}
          </h2>
        );
      } else {
        // Handle bold text within paragraphs
        const parts = paragraph.split('**');
        return (
          <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                return (
                  <span key={partIndex} className="font-bold">
                    {part}
                  </span>
                );
              } else {
                return part;
              }
            })}
          </p>
        );
      }
    });
  };
  
  const renderReviews = (category: string) => {
    const ratingKey = `${category}Rating` as keyof Review;
    const reviewKey = `${category}Review` as keyof Review;
  
    const filteredReviews = reviews.filter(review => {
      if (showVerifiedOnly) {
        return review.verified && review[ratingKey] !== undefined;
      }
      return review[ratingKey] !== undefined;
    });
  
    if (filteredReviews.length === 0) {
      return <p className="text-xl text-center mt-4 dark:text-gray-200">Be the first to review the college.</p>;
    }
  
    return filteredReviews.map((review, index) => {
      const reviewDate = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });
      const ratingValue = typeof review[ratingKey] === 'number' ? review[ratingKey] as number : 0;
      const reviewText = review[reviewKey] as string; // Add this line to get the review text
  
      return (
        <div key={index} className="mb-4 p-4 bg-gray-100 dark:bg-zinc-700 rounded-lg shadow">
          <div className='flex justify-between'>
            <div className="flex items-center mb-2">
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Anonymous</p>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{reviewDate}</span>
            </div>
            {review.verified && (
              <div>
                <IconRosetteDiscountCheckFilled color='yellow' />
              </div>
            )}
          </div>
          <Rating isEditable={false} rating={ratingValue} setRating={() => {}} />
          <p className="mt-2 text-gray-800 dark:text-gray-200">{reviewText}</p> {/* Add this line to display the review text */}
        </div>
      );
    });
  };
  
  


  const renderStarRatingBar = (star: number) => {
    const count = starCounts[star];
    const percentage = (count / reviews.length) * 100;

    return (
      <div className="flex flex-row items-center mb-2" key={star}>
        <p className="flex flex-row text-sm font-semibold text-gray-800 dark:text-gray-200"><span>{star}</span><span>⭐</span></p>
        <div className="w-2/3 h-3 bg-gray-300 dark:bg-zinc-600 rounded-lg mx-2">
          <div
            className="h-3 bg-blue-600 dark:bg-blue-400 rounded-lg"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{percentage }%</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-2 bg-zinc-50 dark:bg-zinc-900">
      <NavbarDemo />
      <div className="w-full max-w-5xl mt-32 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">{college}</h1>
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8">
          <div className="flex md:flex-row flex-col  justify-around items-center">
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
            <div className='flex justify-between'>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reviews
            </h2>
            <div className="flex items-center mb-4">
  <input
    type="checkbox"
    id="verifiedOnly"
    checked={showVerifiedOnly}
    onChange={(e) => setShowVerifiedOnly(e.target.checked)}
    className="mr-2 h-5 w-5"
  />
  <label htmlFor="verifiedOnly" className="text-gray-800 dark:text-gray-200">
        Verified Only
  </label>
</div>

            </div>
            {renderReviews(activeTab)}
          </div>

          

          <div className="mt-8">
          {collegeInfo && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">About {college}</h2>
              <p className="text-gray-800 dark:text-gray-200">{formatCollegeInfo(collegeInfo)}</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;