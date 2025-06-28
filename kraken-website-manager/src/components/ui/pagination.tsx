import React from "react";
import LeftArrow from "../../../public/website-table-icons/arrow-left.svg";
import RightArrow from "../../../public/website-table-icons/arrow-right.svg";
import Image from "next/image";

interface PaginationProps {
  children: React.ReactNode;
}

interface PaginationItemProps {
  children: React.ReactNode;
  isLast?: boolean;
}

interface PaginationLinkProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

interface PaginationButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ children }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className="mx-auto flex w-full justify-center"
  >
    {children}
  </nav>
);

export const PaginationContent: React.FC<PaginationProps> = ({ children }) => (
  <div className="flex flex-row items-center border border-gray-300 rounded-md overflow-hidden">
    {children}
  </div>
);

export const PaginationItem: React.FC<PaginationItemProps> = ({
  children,
  isLast = false,
}) => (
  <div className={`${!isLast ? "border-r border-gray-300" : ""}`}>
    {children}
  </div>
);

export const PaginationLink: React.FC<PaginationLinkProps> = ({
  children,
  isActive = false,
  onClick,
  disabled = false,
}) => (
  <button
    className={`inline-flex items-center justify-center text-sm font-medium transition-colors focus:outline-none h-10 w-8 sm:w-10 ${
      isActive
        ? "bg-border text-primary"
        : "bg-white text-gray-600 hover:bg-gray-50"
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const PaginationPrevious: React.FC<PaginationButtonProps> = ({
  onClick,
  disabled = false,
}) => (
  <button
    className={`inline-flex items-center justify-center text-sm font-medium transition-colors focus:outline-none h-10 px-2 sm:px-4 gap-1 sm:gap-2 ${
      disabled
        ? "bg-[#FEFEFF] text-gray-300 cursor-not-allowed"
        : "bg-[#FEFEFF] text-gray-600 hover:bg-gray-50"
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    <Image
      src={LeftArrow}
      alt="LeftArrow"
      width={16}
      height={16}
      className="sm:w-5 sm:h-5 object-cover"
    />
    <span className="hidden sm:inline">Previous</span>
    <span className="sm:hidden">Prev</span>
  </button>
);

export const PaginationNext: React.FC<PaginationButtonProps> = ({
  onClick,
  disabled = false,
}) => (
  <button
    className={`inline-flex items-center justify-center text-sm font-medium transition-colors focus:outline-none h-10 px-2 sm:px-4 gap-1 sm:gap-2 ${
      disabled
        ? "bg-[#FEFEFF] text-gray-300 cursor-not-allowed"
        : "bg-[#FEFEFF] text-gray-600 hover:bg-gray-50"
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    <span className="hidden sm:inline">Next</span>
    <span className="sm:hidden">Next</span>
    <Image
      src={RightArrow}
      alt="RightArrow"
      width={16}
      height={16}
      className="sm:w-5 sm:h-5 object-cover"
    />
  </button>
);

export const PaginationEllipsis: React.FC = () => (
  <div className="flex items-center justify-center h-10 w-8 sm:w-10 bg-[#FEFEFF] text-gray-600">
    ...
  </div>
);