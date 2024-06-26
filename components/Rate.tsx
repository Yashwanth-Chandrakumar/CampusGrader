"use client"

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';

type ReviewField = {
  rating: number;
  review: string;
};

type RateProps = {
  college: string;
};

const initialReviewState: ReviewField = { rating: 0, review: '' };

const Rate: React.FC<RateProps> = ({ college }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    academic: { ...initialReviewState },
    faculty: { ...initialReviewState },
    infrastructure: { ...initialReviewState },
    accommodation: { ...initialReviewState },
    socialLife: { ...initialReviewState },
    fee: { ...initialReviewState },
    placement: { ...initialReviewState },
    food: { ...initialReviewState },
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleReviewChange = (field: keyof typeof formData, type: 'rating' | 'review', value: string | number) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [type]: type === 'rating' ? Number(value) : value,
      } as ReviewField,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formattedData = {
        name: college,
        email: session?.user?.email,
        ...Object.entries(formData).reduce((acc, [key, value]) => ({
          ...acc,
          [`${key}Rating`]: value.rating,
          [`${key}Review`]: value.review,
        }), {}),
      };
      
      const response = await fetch('/api/college', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add review');
      }

      router.push('/college');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to add review. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const renderReviewFields = (field: keyof typeof formData, label: string) => (
    <div className="mb-4">
      <h3 className="font-semibold mb-2 dark:text-gray-200">{label}</h3>
      <input
        type="number"
        min="0"
        max="5"
        step="0.1"
        value={formData[field].rating}
        onChange={(e) => handleReviewChange(field, 'rating', e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        placeholder="Rating (0-5)"
      />
      <textarea
        value={formData[field].review}
        onChange={(e) => handleReviewChange(field, 'review', e.target.value)}
        className="w-full p-2 border rounded mt-2 dark:bg-gray-700 dark:text-white"
        placeholder="Review"
      />
    </div>
  );

  return (
    <div className={`max-w-2xl mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Rate {college}</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {darkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderReviewFields('academic', 'Academic')}
        {renderReviewFields('faculty', 'Faculty')}
        {renderReviewFields('infrastructure', 'Infrastructure')}
        {renderReviewFields('accommodation', 'Accommodation')}
        {renderReviewFields('socialLife', 'Social Life')}
        {renderReviewFields('fee', 'Fee')}
        {renderReviewFields('placement', 'Placement')}
        {renderReviewFields('food', 'Food')}

        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
          Submit Review
        </button>
      </form>
    </div>
  );
};

const RateCollege = ({college}:{college:string}) => {
    return (
      <SessionProvider>
        <Rate college={college}/>
      </SessionProvider>
    )
  }

  export default RateCollege