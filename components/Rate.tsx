// Import necessary libraries and components
"use client";
import badWords from "bad-words";
import Fuse from "fuse.js";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { dictionary } from "./dictionary";
import NavbarDemo from "./navbar";
import Rating from "./rating/Rating";

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

const initialReviewState: ReviewField = { rating: 0, review: "" };

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
  const [error, setError] = useState<string>("");
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
  const [idCard, setIdCard] = useState<File | null>(null);

  const handleIDCardUpload = (file: File) => {
    setIdCard(file);
  };

  // Initialize Fuse for fuzzy matching
  const fuse = new Fuse(dictionary, { includeScore: true });

  // Initialize bad-words filter
  const filter = new badWords();

  const handleReviewChange = (field: keyof FormDataType, type: "rating" | "review", value: string | number | React.SetStateAction<number>) => {
    if (type === "rating") {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          rating: typeof value === "function" ? value(prev[field].rating) : Number(value),
        },
      }));
    }
    if (type === "review") {
      // Check for typos and suggest corrections
      const words = (value as string).split(/\s+/);
      const corrections: { [word: string]: string } = {};
      words.forEach((word) => {
        if (!dictionary.includes(word.toLowerCase())) {
          const result = fuse.search(word);
          if (result.length > 0 && result[0].score !== undefined && result[0].score < 0.3) {
            corrections[word] = result[0].item;
          }
        }
      });
      setSuggestedCorrections((prev) => ({
        ...prev,
        [field]: corrections,
      }));

      // Check for NSFW content
      setContainsNSFW((prev) => ({
        ...prev,
        [field]: filter.isProfane(value as string),
      }));

      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          review: value as string,
        },
      }));
    }
  };

  const applyCorrection = (field: keyof FormDataType, original: string, corrected: string) => {
    const newReview = formData[field].review.replace(new RegExp(`\\b${original}\\b`, "g"), corrected);
    handleReviewChange(field, "review", newReview);
    setSuggestedCorrections((prev) => {
      const newCorrections = { ...prev[field] };
      delete newCorrections[original];
      return { ...prev, [field]: newCorrections };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const hasNSFWContent = Object.values(containsNSFW).some((value) => value === true);

    if (hasNSFWContent) {
      setError("Your review contains inappropriate language. Please revise before submitting.");
      return;
    }

    try {
      const reviewData = {
        email: session?.user?.email || "",
        ...Object.entries(formData).reduce((acc, [key, value]) => ({
          ...acc,
          [`${key}Rating`]: value.rating,
          [`${key}Review`]: value.review,
        }), {}),
      };

      // First, post the review
      const response = await fetch(`/api/rate/${encodeURIComponent(college)}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add review");
      }

      const reviewResult = await response.json();

      // If there is an ID card to upload, do it
      if (idCard) {
        const imageFormData = new FormData();
        imageFormData.append('file', idCard);
        imageFormData.append('collegeId', reviewResult._id); // Use the ID from the review result

        const imageResponse = await fetch('/api/s3', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(errorData.message || "Failed to upload image");
        }
      }

      router.push(`/view/${encodeURIComponent(college)}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to add review. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const renderReviewFields = (field: keyof FormDataType, label: string, description: string) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">{label}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      <Rating
        isEditable={true}
        rating={formData[field].rating}
        setRating={(newRating) => handleReviewChange(field, "rating", newRating)}
        className="text-yellow-400 py-2"
      />
      <textarea
        value={formData[field].review}
        onChange={(e) => handleReviewChange(field, "review", e.target.value)}
        className="w-full p-2 border rounded bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 mb-2"
        placeholder="Review"
        rows={4}
      />
      {Object.entries(suggestedCorrections[field]).map(([original, corrected]) => (
        <div key={original} className="text-sm text-blue-600 dark:text-blue-400 mt-1">
          Did you mean &quot;{corrected}&quot; instead of &quot;{original}&quot;?
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
        <h1 className="text-2xl pl-2 md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Rate {college}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Your honest feedback is valuable. Please provide genuine reviews to help future students make correct decisions.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8">
          {renderReviewFields("academic", "Academic", "Rate the quality of the academic programs, curriculum, and overall academic experience.")}
          {renderReviewFields("faculty", "Faculty", "Rate the expertise, teaching quality, and approachability of the faculty members.")}
          {renderReviewFields("infrastructure", "Infrastructure", "Rate the facilities such as classrooms, laboratories, libraries, and other physical infrastructure.")}
          {renderReviewFields("accommodation", "Accommodation", "Rate the quality and comfort of the on-campus housing or nearby accommodations.")}
          {renderReviewFields("socialLife", "Social Life", "Rate the social environment, extracurricular activities, and community engagement opportunities.")}
          {renderReviewFields("fee", "Fee", "Rate the affordability and value for money regarding the tuition and other fees. Fee structure is highly welcomed.")}
          {renderReviewFields("placement", "Placement", "Rate the effectiveness of the placement cell and the opportunities provided for internships and job placements.")}
          {renderReviewFields("food", "Food", "Rate the quality, variety, and availability of food options on campus.")}

          <div className="mb-6">
            <label htmlFor="idCard" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
              Upload ID Card
            </label>
            <p className="text-sm my-2 text-gray-500 dark:text-gray-400">
              We use a verification tick mark to show that your review is genuine. Rest assured, your files are not stored anywhere.
            </p>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="idCard"
                name="idCard"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleIDCardUpload(e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="idCard"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v16h16V4H4zm16 0v16H4V4h16zm-9 12H9v-2h2v2zm4 0h-2v-2h2v2zm1-6H7V7h10v3z" />
                </svg>
                <span className="ml-2">Choose File</span>
              </label>
              {idCard && <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">{idCard.name}</span>}
            </div>
          </div>

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

const RateCollege = ({ college }: { college: string }) => {
  return (
    <SessionProvider>
      <NavbarDemo />
      <Rate college={college} />
    </SessionProvider>
  );
};

export default RateCollege;
