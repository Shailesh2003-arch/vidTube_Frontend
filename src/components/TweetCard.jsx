import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export const TweetCard = ({ tweet, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="mb-4 break-inside-avoid rounded-xl border shadow-sm 
      bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 relative"
    >
      {/* Tweet content */}
      <div className={`${tweet.image ? "p-4" : "p-3"}`}>
        <p className="text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-relaxed">
          {tweet.content}
        </p>

        {tweet.image?.url && (
          <img
            src={tweet.image.url}
            alt="Tweet"
            className="mt-3 w-full rounded-lg object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </div>

      {/* Three dots menu */}
      <div className="absolute top-2 right-2" ref={menuRef}>
        <MoreHorizontal
          className="w-5 h-5 cursor-pointer text-gray-500 dark:text-gray-300"
          onClick={() => setIsOpen((prev) => !prev)}
        />

        {isOpen && (
          <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-900 shadow-lg rounded-md z-10">
            <button
              onClick={() => {
                // onEdit(tweet);
                // setIsOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(tweet._id);
                setIsOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
