"use client"

interface SuggestionsProps {
    inputValue: string;
    onItemClick: (item: string) => void;
    listItems:string[];
  }
  
  const Suggestions: React.FC<SuggestionsProps> = ({
    inputValue,
    onItemClick,
    listItems,
  }) => {
    const filteredItems = listItems.filter((item) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    const handleItemClick = (item: string) => {
      onItemClick(item);
    };
    return (
      <div
        className={`mt-5 ${
          inputValue === "" ? "hidden" : "-mb-10"
        } bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4`}
      >
        {filteredItems.length > 0 ? (
          <ul>
            {filteredItems.slice(0, 6).map((item, index) => (
              <li
                key={index}
                className="text-gray-800 dark:text-gray-200 py-2 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
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
  