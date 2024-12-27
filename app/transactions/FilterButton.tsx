"use client";

import { useState } from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

export default function FilterButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <button
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      onClick={toggleDropdown}
    >
      <CalendarIcon className="h-4 w-4" />
      Last 30 Days
      <ChevronDownIcon className="h-4 w-4" />
    </button>
  );
}
