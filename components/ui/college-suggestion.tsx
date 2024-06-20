import React, { useEffect, useRef } from 'react';
interface SuggestionsProps {
  inputValue: string;
  onItemClick: (item: string) => void;
  listItems: string[];
  isActive: boolean;  // New prop to control behavior
}

const Suggestions: React.FC<SuggestionsProps> = ({
  inputValue,
  onItemClick,
  listItems,
  isActive
}) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const filteredItems = listItems.filter(item =>
      item.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (isActive && suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
              onItemClick('');  // Clears the input only if isActive is true
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [isActive, onItemClick]);

  if (!inputValue) return null;

  return (
      <div ref={suggestionsRef} className={`mt-5 ${inputValue === "" ? "hidden" : "-mb-10"} bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4`}>
          {filteredItems.length > 0 ? (
              <ul>
                  {filteredItems.slice(0, 6).map((item, index) => (
                      <li key={index} className="text-gray-800 dark:text-gray-200 py-2 cursor-pointer" onClick={() => onItemClick(item)}>
                          {item}
                      </li>
                  ))}
              </ul>
          ) : (
              <p className="text-gray-500 dark:text-gray-400">No matching items</p>
          )}
      </div>
  );
};

export default Suggestions;
