import { useEffect, useState } from "react";
import NavbarDemo from "./navbar";
import Rating from "./rating/Rating";

const fetchReviews = async (college: string) => {
  const response = await fetch(`/api/getReviews/${college}`);
  const data = await response.json();
  return data;
};

const View = ({ college }: { college: string }) => {
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('academic');

  useEffect(() => {
    fetchReviews(college).then((data) => setReviews(data.reviews));
  }, [college]);

  const renderReviews = (category: string) => {
    const filteredReviews = reviews.filter((review) => review[`${category}Rating`] !== undefined);

    if (filteredReviews.length === 0) {
      return <p className="text-xl text-center mt-4">Be the first to review the college.</p>;
    }

    return filteredReviews.map((review: any, index: number) => (
      <div key={index} className="mb-4">
        <p className="text-xl font-semibold">Anonymous</p>
        <Rating isEditable={false} rating={review[`${category}Rating`]} setRating={() => {}} />
        <p>{review[`${category}Review`]}</p>
      </div>
    ));
  };

  return (
    <div className="flex flex-col mt-32 text-black dark:text-white items-center min-h-screen py-2 bg-zinc-50 dark:bg-zinc-900">
      <NavbarDemo />
      <div className="w-full max-w-7xl mt-10 p-10">
        <h1 className="text-2xl">{college}</h1>
        <Rating isEditable={false} rating={4} setRating={setUserRating} />
        <p>{userRating}</p>

        <div className="flex space-x-4 mt-8">
          {['academic', 'faculty', 'infrastructure', 'accommodation', 'socialLife', 'fee', 'placement', 'food'].map((category) => (
            <button
              key={category}
              className={`py-2 px-4 ${activeTab === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setActiveTab(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-8 w-full">
          {renderReviews(activeTab)}
        </div>
      </div>
    </div>
  );
};

export default View;
