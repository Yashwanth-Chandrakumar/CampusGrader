"use client"

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
type ReviewField = {
  rating: number;
  review: string;
};

type CollegeForm = {
  name: string;
  email: string;
  academic: ReviewField;
  faculty: ReviewField;
  infrastructure: ReviewField;
  accommodation: ReviewField;
  socialLife: ReviewField;
  fee: ReviewField;
  placement: ReviewField;
  food: ReviewField;
};

const initialReviewState: ReviewField = { rating: 0, review: '' };

const AddCollegeForm: React.FC = () => {
  const { data: session,status} = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<CollegeForm>({
    name: '',
    email: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReviewChange = (field: keyof Omit<CollegeForm, 'name' | 'email'>, type: 'rating' | 'review', value: string | number) => {
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
        name: formData.name,
        email: session?.user?.email,
        academicRating: formData.academic.rating,
        academicReview: formData.academic.review,
        facultyRating: formData.faculty.rating,
        facultyReview: formData.faculty.review,
        infrastructureRating: formData.infrastructure.rating,
        infrastructureReview: formData.infrastructure.review,
        accommodationRating: formData.accommodation.rating,
        accommodationReview: formData.accommodation.review,
        socialLifeRating: formData.socialLife.rating,
        socialLifeReview: formData.socialLife.review,
        feeRating: formData.fee.rating,
        feeReview: formData.fee.review,
        placementRating: formData.placement.rating,
        placementReview: formData.placement.review,
        foodRating: formData.food.rating,
        foodReview: formData.food.review,
      };
      console.log(JSON.stringify(formattedData))
      const response = await fetch('/api/college', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add college');
      }
  
      router.push('/college');
    } catch (err) {
      setError(err.message || 'Failed to add college. Please try again.');
    }
  };

  const renderReviewFields = (field: keyof Omit<CollegeForm, 'name' | 'email'>, label: string) => (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{label}</h3>
      <input
        type="number"
        min="0"
        max="5"
        step="0.1"
        value={formData[field].rating}
        onChange={(e) => handleReviewChange(field, 'rating', e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Rating (0-5)"
      />
      <textarea
        value={formData[field].review}
        onChange={(e) => handleReviewChange(field, 'review', e.target.value)}
        className="w-full p-2 border rounded mt-2"
        placeholder="Review"
      />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add New College</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2 font-semibold">College Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {renderReviewFields('academic', 'Academic')}
        {renderReviewFields('faculty', 'Faculty')}
        {renderReviewFields('infrastructure', 'Infrastructure')}
        {renderReviewFields('accommodation', 'Accommodation')}
        {renderReviewFields('socialLife', 'Social Life')}
        {renderReviewFields('fee', 'Fee')}
        {renderReviewFields('placement', 'Placement')}
        {renderReviewFields('food', 'Food')}

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add College
        </button>
      </form>
    </div>
  );
};

const AddCollege = () => {
  return (
    <SessionProvider>
      <AddCollegeForm/>
    </SessionProvider>
  )
}

export default AddCollege;