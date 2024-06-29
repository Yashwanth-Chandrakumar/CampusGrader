"use cient"
import badWords from 'bad-words';
import Fuse from 'fuse.js';
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';

import { dictionary } from './dictionary';
import NavbarDemo from './navbar';

type ReviewField = {
  rating: number;
  review: string;
};

type RateProps = {
  college: string;
};

type FormDataType = {
  [key: string]: ReviewField;
};

type SuggestedCorrectionsType = {
  [key: string]: { [word: string]: string };
};

const initialReviewState: ReviewField = { rating: 0, review: '' };

const Rate: React.FC<RateProps> = ({ college }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataType>({
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
  const [suggestedCorrections, setSuggestedCorrections] = useState<SuggestedCorrectionsType>({
    academic: {},
    faculty: {},
    infrastructure: {},
    accommodation: {},
    socialLife: {},
    fee: {},
    placement: {},
    food: {},
  });
  const [containsNSFW, setContainsNSFW] = useState<{ [key: string]: boolean }>({});

  // Initialize Fuse for fuzzy matching
  const fuse = new Fuse(dictionary, { includeScore: true });

  // Initialize bad-words filter
  const filter = new badWords();

  const handleReviewChange = (field: keyof FormDataType, type: 'rating' | 'review', value: string | number) => {
    if (type === 'review') {
      // Check for typos and suggest corrections
      const words = (value as string).split(/\s+/);
      const corrections: { [word: string]: string } = {};
      words.forEach(word => {
        if (!dictionary.includes(word.toLowerCase())) {
          const result = fuse.search(word);
          if (result.length > 0 && result[0].score !== undefined && result[0].score < 0.3) {
            corrections[word] = result[0].item;
          }
        }
      });
      setSuggestedCorrections(prev => ({
        ...prev,
        [field]: corrections
      }));

      // Check for NSFW content
      setContainsNSFW(prev => ({
        ...prev,
        [field]: filter.isProfane(value as string)
      }));
    }

    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: type === 'rating' ? Number(value) : value,
      },
    }));
  };

  const applyCorrection = (field: keyof FormDataType, original: string, corrected: string) => {
    const newReview = formData[field].review.replace(new RegExp(`\\b${original}\\b`, 'g'), corrected);
    handleReviewChange(field, 'review', newReview);
    setSuggestedCorrections(prev => {
      const newCorrections = { ...prev[field] };
      delete newCorrections[original];
      return { ...prev, [field]: newCorrections };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const hasNSFWContent = Object.values(containsNSFW).some(value => value === true);

  if (hasNSFWContent) {
    setError('Your review contains inappropriate language. Please revise before submitting.');
    return;
  }
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
      
      const response = await fetch(`/api/rate/${college}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add review');
      }
      router.push(`/view/${college}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to add review. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const renderReviewFields = (field: keyof FormDataType, label: string) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">{label}</h3>
      <input
        type="number"
        min="0"
        max="5"
        step="0.1"
        value={formData[field].rating}
        onChange={(e) => handleReviewChange(field, 'rating', e.target.value)}
        className="w-full p-2 border rounded bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 mb-2"
        placeholder="Rating (0-5)"
      />
      <textarea
        value={formData[field].review}
        onChange={(e) => handleReviewChange(field, 'review', e.target.value)}
        className="w-full p-2 border rounded bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 mb-2"
        placeholder="Review"
        rows={4}
      />
      {Object.entries(suggestedCorrections[field]).map(([original, corrected]) => (
        <div key={original} className="text-sm text-blue-600 dark:text-blue-400 mt-1">
          Did you mean "{corrected}" instead of "{original}"?
          <button 
            onClick={() => applyCorrection(field, original, corrected)}
            className="ml-2 underline hover:text-blue-800 dark:hover:text-blue-300"
          >
            Apply correction
          </button>
        </div>
      ))}
      {containsNSFW[field] && (
        <p className="text-red-500 dark:text-red-400 mt-1">
          Your review contains inappropriate language. Please revise before submitting.
        </p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen py-2 bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-4xl mt-32">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Rate {college}</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8">
          {renderReviewFields('academic', 'Academic')}
          {renderReviewFields('faculty', 'Faculty')}
          {renderReviewFields('infrastructure', 'Infrastructure')}
          {renderReviewFields('accommodation', 'Accommodation')}
          {renderReviewFields('socialLife', 'Social Life')}
          {renderReviewFields('fee', 'Fee')}
          {renderReviewFields('placement', 'Placement')}
          {renderReviewFields('food', 'Food')}

          {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

          <button 
            type="submit" 
            className="bg-gradient-to-br relative group/btn mt-2 from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

const RateCollege = ({college}:{college:string}) => {
  return (
    <SessionProvider>
        <NavbarDemo/>
      <Rate college={college}/>
    </SessionProvider>
  )
}

export default RateCollege;