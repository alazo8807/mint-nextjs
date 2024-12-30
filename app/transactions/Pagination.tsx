import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  totalTransactions,
  onPageChange,
}: PaginationProps) {
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 4;
    const halfMaxVisibleButtons = Math.floor(maxVisibleButtons / 2);

    let startPage = Math.max(
      1,
      Math.min(currentPage - halfMaxVisibleButtons, totalPages - maxVisibleButtons + 1)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === i
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * 10 + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * 10, totalTransactions)}
          </span>{" "}
          of <span className="font-medium">{totalTransactions}</span> results
        </p>
      </div>
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        {/* Navigate to First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronsLeft className="h-5 w-5" />
        </button>

        {/* Navigate to Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Middle Pagination Buttons */}
        {generatePaginationButtons()}

        {/* Navigate to Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Navigate to Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronsRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
