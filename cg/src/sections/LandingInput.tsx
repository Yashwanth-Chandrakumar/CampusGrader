import { useState } from "react";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import Suggestions from "./Suggestions";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "Find by course name.",
    "Rate the college you studied.",
    "Why are you still waiting?",
    "Let's help one to have his future",
  ];
  const [input, setInput] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className=" flex flex-col justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <Suggestions inputValue={input} />
    </div>
  );
}
