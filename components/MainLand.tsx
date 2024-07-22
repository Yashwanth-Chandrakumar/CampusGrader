"use client";

import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listItems } from "./CollegeList";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const MainLand = () => {
  return (
    <div>
      <Landingpage />
    </div>
  );
};

const Landingpage = () => {
  const placeholders = [""];
  const router = useRouter();
  const [input, setInput] = useState("");
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);
  const [mostReviewedColleges, setMostReviewedColleges] = useState<{ name: string, totalReviews: number }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    updateFilteredColleges(value);
    localStorage.setItem("searchedCollege", value);
  };

  const handleItemClick = (item: string) => {
    setInput(item); // Deactivates suggestions as an item has been clicked
    updateFilteredColleges(item);
  };

  const updateFilteredColleges = (searchValue: string) => {
    const filtered = listItems
      .filter((college) =>
        college.toLowerCase().includes(searchValue.toLowerCase())
      )
      .slice(0, 5); // Get top 5 results
    setFilteredColleges(filtered);
  };

  useEffect(() => {
    const collegeSearch = localStorage.getItem("searchedCollege");
    if (collegeSearch) {
      setInput(collegeSearch);
      updateFilteredColleges(collegeSearch);
    }
  }, []);

  useEffect(() => {
    const fetchMostReviewedColleges = async () => {
      try {
        const response = await fetch('/api/getrank');
        const data = await response.json();
        setMostReviewedColleges(data.colleges);
      } catch (error) {
        console.error('Error fetching most reviewed colleges:', error);
      }
    };

    fetchMostReviewedColleges();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-2 bg-zinc-50 dark:bg-zinc-900 ">
      <div className="w-full max-w-4xl mt-32">
        <SessionProvider>
          <PlaceholdersAndVanishInput
            college={input}
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </SessionProvider>
      </div>
      <div className="w-full max-w-4xl mt-10">
        <section className="mt-5 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
          <h2 className="text-gray-800 dark:text-gray-200 py-2 font-bold">Search Result</h2>
          {filteredColleges.length > 0 ? (
            filteredColleges.map((college, index) => (
              <>
                <div key={index} className="flex flex-col md:flex-row justify-between items-center text-gray-800 dark:text-gray-200 p-2 ">
                  <span>{college}</span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/view/${encodeURIComponent(college)}`}
                      className="bg-gradient-to-br relative px-10 group/btn mt-2 from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center"
                    >
                      View
                    </Link>
                    <Link
                      href={`/rate/${encodeURIComponent(college)}`}
                      className="bg-gradient-to-br relative px-10 group/btn mt-2 from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center"
                    >
                      Rate
                    </Link>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-3 h-[1px] w-full" />
              </>
            ))
          ) : (
            <p className="text-gray-800 dark:text-gray-200">No results found</p>
          )}
        </section>
        <section className="mt-5 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
  <h2 className="text-gray-800 dark:text-gray-200 py-2 font-bold">Most Reviewed Colleges</h2>
  {mostReviewedColleges.length > 0 ? (
    mostReviewedColleges.map((college, index) => (
      <div 
        key={index} 
        className="flex flex-col md:flex-row justify-between items-center p-2"
      >
        
        <span className={index <3  ? 'text-yellow-500' : 'text-gray-800 dark:text-gray-200'}>
          {index}.
        </span>
        <span className={index <3  ? 'text-yellow-500' : 'text-gray-800 dark:text-gray-200'}>
          {college._id}
        </span>
        <span className={index < 3 ? 'text-yellow-500' : 'text-gray-800 dark:text-gray-200'}>
          {college.totalReviews} reviews
        </span>
      </div>
    ))
  ) : (
    <p className="text-gray-800 dark:text-gray-200">No reviews found</p>
  )}
</section>

      </div>
    </div>
  );
};

export default MainLand;
