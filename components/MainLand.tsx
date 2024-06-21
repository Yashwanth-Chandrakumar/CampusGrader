"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { listItems } from "./CollegeList";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const MainLand = () => {
  return (
    <div>
      <SessionProvider>
        <Landingpage />
      </SessionProvider>
    </div>
  );
};

const Landingpage = () => {
  const placeholders = [
    ""
  ];

  const [input, setInput] = useState("");
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    updateFilteredColleges(value);
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
              <p key={index} className="text-gray-800 dark:text-gray-200">
                {college}
              </p>
            ))
          ) : (
            <p className="text-gray-800 dark:text-gray-200">No results found</p>
          )}
        </section>
        <section className="mt-5 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
          <h2 className="text-gray-800 dark:text-gray-200 py-2 font-bold">Top Colleges in Your Area</h2>
          <p className="text-gray-800 dark:text-gray-200">Content for top colleges in your area...</p>
        </section>
        <section className="mt-5 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
          <h2 className="text-gray-800 dark:text-gray-200 py-2 font-bold">Most Viewed Colleges</h2>
          <p className="text-gray-800 dark:text-gray-200">Content for most viewed colleges...</p>
        </section>
      </div>
    </div>
  );
};

export default MainLand;
