
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { listItems } from "./CollegeList";
import Suggestions from "./ui/college-suggestion";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
export function PlaceholdersAndVanishInputDemo({navUrl}: Readonly<{navUrl: string;}>) {
  const placeholders = [
    "Find by course name.",
    "Rate the college you studied.",
    "Why are you still waiting?",
    "Let's help one to have his future",
  ];

  const [input, setInput] = useState("");
  const [selected, setSelected] = useState("");
  const [isActive, setIsActive] = useState(false);  // Tracks if suggestions are actively being used

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsActive(true);  // Activates suggestions when typing
    if (!selected) {
      setSelected(e.target.value);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const handleItemClick = (item: string) => {
    setSelected(item);
    setInput(item);
    setIsActive(false);  // Deactivates suggestions as an item has been clicked
  };

  return (
    <div className="flex flex-col justify-center items-center px-4">
      <SessionProvider>
        <PlaceholdersAndVanishInput
          college={input}
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
          nextUrl={navUrl}
        />
      </SessionProvider>
      <Suggestions listItems={listItems} inputValue={input} onItemClick={handleItemClick} isActive={isActive}/>
    </div>
  );
}

