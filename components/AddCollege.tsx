"use client"

import { useRouter } from "next/navigation";
import React, { useState } from 'react';

type ReviewField = {
  rating: number;
  review: string;
};

type CollegeForm = {
  name: string;
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

const AddCollege: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CollegeForm>({
    name: '',
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

  const handleReviewChange = (field: keyof Omit<CollegeForm, 'name'>, type: 'rating' | 'review', value: string | number) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [type]: type === 'rating' ? Number(value) : value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: 'placeholder-user-id' }),
      });

      if (!response.ok) throw new Error('Failed to add college');

      router.push('/colleges');
    } catch (err) {
      setError('Failed to add college. Please try again.');
    }
  };

  const renderReviewFields = (field: keyof Omit<CollegeForm, 'name'>, label: string) => (
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

export default AddCollege;