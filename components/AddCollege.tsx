"use client";

import { useState } from 'react';

interface Review {
  rating: number;
  review: string;
}

const AddCollegeForm = () => {
  const [name, setName] = useState('');
  const [academic, setAcademic] = useState<Review>({ rating: 0, review: '' });
  const [faculty, setFaculty] = useState<Review>({ rating: 0, review: '' });
  const [infrastructure, setInfrastructure] = useState<Review>({ rating: 0, review: '' });
  const [accommodation, setAccommodation] = useState<Review>({ rating: 0, review: '' });
  const [socialLife, setSocialLife] = useState<Review>({ rating: 0, review: '' });
  const [fee, setFee] = useState<Review>({ rating: 0, review: '' });
  const [placement, setPlacement] = useState<Review>({ rating: 0, review: '' });
  const [food, setFood] = useState<Review>({ rating: 0, review: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = '6675727b2cb1b7e4450ebe8a'; // You need to set the userId properly based on your application logic

    const response = await fetch('/api/college', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        userId,
        academic,
        faculty,
        infrastructure,
        accommodation,
        socialLife,
        fee,
        placement,
        food,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('College created:', data);
    } else {
      console.error('Error creating college');
    }
  };

  const handleRatingChange = (setter: React.Dispatch<React.SetStateAction<Review>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(prev => ({ ...prev, rating: Number(e.target.value) }));
  };

  const handleReviewChange = (setter: React.Dispatch<React.SetStateAction<Review>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(prev => ({ ...prev, review: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>College Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      {[
        { category: 'academic', state: academic, setter: setAcademic },
        { category: 'faculty', state: faculty, setter: setFaculty },
        { category: 'infrastructure', state: infrastructure, setter: setInfrastructure },
        { category: 'accommodation', state: accommodation, setter: setAccommodation },
        { category: 'socialLife', state: socialLife, setter: setSocialLife },
        { category: 'fee', state: fee, setter: setFee },
        { category: 'placement', state: placement, setter: setPlacement },
        { category: 'food', state: food, setter: setFood },
      ].map(({ category, state, setter }) => (
        <div key={category}>
          <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
          <div>
            <label>Rating</label>
            <input type="number" value={state.rating} onChange={handleRatingChange(setter)} />
          </div>
          <div>
            <label>Review</label>
            <input type="text" value={state.review} onChange={handleReviewChange(setter)} />
          </div>
        </div>
      ))}
      <button type="submit">Add College</button>
    </form>
  );
};

export default AddCollegeForm;
