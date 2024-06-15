
import { useState } from "react";
import { listItems } from "./CollegeList";
import Suggestions from "./ui/college-suggestion";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "Find by course name.",
    "Rate the college you studied.",
    "Why are you still waiting?",
    "Let's help one to have his future",
  ];

  const [input, setInput] = useState("");
  const [selected, setSelected] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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

  };
  return (
    <div className=" flex flex-col justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        college={input}
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <Suggestions listItems={listItems} inputValue={input} onItemClick={handleItemClick}/>
    </div>
  );
}
