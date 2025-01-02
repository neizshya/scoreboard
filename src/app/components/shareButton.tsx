"use client";

import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaTelegramPlane, FaFacebook } from "react-icons/fa";

export function ShareButton({
  score,
  username,
}: {
  score: number;
  username: string | null;
}) {
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={toggleDropdown}>
        Share
      </button>
      {dropdownVisible && (
        <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow-lg text-black z-10 w-48">
          <a
            href={`https://wa.me/?text=Hey, Look how ${username} scored ${score}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 hover:bg-gray-100 rounded">
            <FaWhatsapp className="text-green-500 text-lg mr-2" />
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${username}%20scored%20${score}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 hover:bg-gray-100 rounded">
            <FaTelegramPlane className="text-blue-500 text-lg mr-2" />
            Telegram
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${username}%20scored%20${score}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 hover:bg-gray-100 rounded">
            <FaFacebook className="text-blue-700 text-lg mr-2" />
            Facebook
          </a>
        </div>
      )}
    </div>
  );
}
