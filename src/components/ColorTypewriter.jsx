import { useEffect, useState } from "react";

const words = ["comfort", "safety", "convenience"];
const colors = ["text-blue-600", "text-red-600", "text-green-600"];

const ColorTypewriter = () => {
  const [index, setIndex] = useState(0); // current word
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];
    const typingSpeed = isDeleting ? 80 : 150;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setText((prev) => prev.slice(0, -1));
      } else {
        setText((prev) => currentWord.slice(0, prev.length + 1));
      }

      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), 1000); // pause before delete
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index]);

  return (
    <span className={`font-semibold font-[Marcellus] ${colors[index]}`}>
      {text}
      <span className="border-r-2 border-gray-400 animate-pulse ml-0.5" />
    </span>
  );
};

export default ColorTypewriter;
