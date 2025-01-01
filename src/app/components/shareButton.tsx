"use client";

import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaTelegramPlane, FaFacebook } from "react-icons/fa";

export function ShareButton({ score }: { score: number }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className=" inline-block" ref={dropdownRef}>
      <button
        className="py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={toggleDropdown}>
        Share
      </button>
      {dropdownVisible && (
        <div
          className="absolute bg-white border rounded shadow-lg text-black z-10 mt-1 flex space-x-1 
                     top-full transform -translate-y-2 right-0 sm:left-auto sm:mt-0 sm:top-0 sm:translate-x-full sm:translate-y-0">
          <a
            href={`https://wa.me/?text=Hey, Look how I scored ${score}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-2 py-2 hover:bg-gray-100 rounded">
            <FaWhatsapp className="text-green-500 text-lg" />
          </a>
          <a
            href={`https://t.me/share/url?url=I%20scored%20${score}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-2 py-2 hover:bg-gray-100 rounded">
            <FaTelegramPlane className="text-blue-500 text-lg" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=I%20scored%20${score}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-2 py-2 hover:bg-gray-100 rounded">
            <FaFacebook className="text-blue-700 text-lg" />
          </a>
        </div>
      )}
    </div>
  );
}
