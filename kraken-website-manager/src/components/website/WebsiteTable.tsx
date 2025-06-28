"use client";
import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LANGUAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Plus, Eye, EyeOff } from "lucide-react";
import { useWebsiteStore } from "@/stores/websiteStore";
import { getCountryFlagUrl } from "@/lib/utils";
import { Label } from "../ui/label";
import Icon1 from "../../../public/website-table-icons/Icon1.svg";
import Icon2 from "../../../public/website-table-icons/Icon2.svg";
import Icon3 from "../../../public/website-table-icons/Icon3.svg";
import Icon4 from "../../../public/website-table-icons/Icon4.svg";
import Icon5 from "../../../public/website-table-icons/Icon5.svg";
import Icon6 from "../../../public/website-table-icons/Icon6.svg";

const icons = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6];

const greyNicheLabels = [
  "Adult content",
  "Gambling",
  "Pharmaceuticals",
  "Cryptocurrency",
  "Dating",
  "Finance",
];

// Type definitions
interface Website {
  id: string;
  url: string;
  trafficCountry: string;
  primaryLanguage: string;
  mainCategory: string;
  otherCategories: string[];
}

const COLUMNS = [
  {
    key: "website",
    label: "Website",
    width: "w-[280px]",
    maxWidth: "max-w-[260px]",
  },
  { key: "country", label: "Country", width: "w-[160px]" },
  { key: "language", label: "Language", width: "w-[130px]" },
  { key: "category", label: "Category", width: "w-[180px]" },
  { key: "otherCategories", label: "Other categories", width: "w-[180px]" },
  { key: "greyNiches", label: "Grey niches", width: "w-[160px]" },
] as const;

const STYLES = {
  rowEven: "bg-#FEFEFF",
  rowOdd: "bg-[#613FDD05]",
  headerBg: "bg-[#613FDD05]",
  cellPadding: "py-4 px-4",
  button:
    "bg-secondary hover:bg-[#4e32c2] text-white w-full sm:w-[228px] px-4 py-2 rounded-lg font-medium",
} as const;

const CountryFlag = React.memo<{ country: string }>(({ country }) => (
  <div className="flex items-center gap-2">
    <Image
      src={getCountryFlagUrl(country)}
      alt="" 
      width={21}
      height={14}
      className="object-cover flex-shrink-0"
      role="presentation"
    />
    <Label fontSize={13} fontWeight={400} className="truncate">
      {country}
    </Label>
  </div>
));
CountryFlag.displayName = 'CountryFlag';

const GreyNichesIcons = React.memo<{ showAll?: boolean }>(
  ({ showAll = false }) => (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label="Grey niche categories"
    >
      {(showAll ? icons : icons.slice(0, 4)).map((Icon, index) => (
        <div key={index} className="w-5 h-5 flex-shrink-0">
          <Image
            className="dark:invert"
            src={Icon}
            alt={greyNicheLabels[index] || `Category ${index + 1}`}
            width={16}
            height={16}
            priority
          />
        </div>
      ))}
      {!showAll && icons.length > 4 && (
        <span className="text-xs text-gray-500 ml-1">+{icons.length - 4}</span>
      )}
    </div>
  )
);
GreyNichesIcons.displayName = 'GreyNichesIcons';

const AddWebsiteButton = React.memo(() => (
  <Link href="/add-website">
    <Button className={STYLES.button}>
      <Plus className="w-4 h-4 mr-2" />
      Add website
    </Button>
  </Link>
));
AddWebsiteButton.displayName = 'AddWebsiteButton';

const EmptyState = React.memo(() => (
  <div className="text-center py-8 sm:py-12 px-4">
    <div className="mx-auto max-w-md">
      <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Plus className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No websites yet
      </h3>
      <p className="text-gray-500 mb-6">
        Get started by adding your first website to the marketplace.
      </p>
      <AddWebsiteButton />
    </div>
  </div>
));
EmptyState.displayName = 'EmptyState';

const getLanguageLabel = (languageCode: string) => {
  const language = LANGUAGES.find((lang) => lang.value === languageCode);
  return language?.label || languageCode;
};

const renderCellContent = (
  website: Website,
  columnKey: string,
  showAll = false
) => {
  switch (columnKey) {
    case "website":
      return (
        <Label
          fontSize={13}
          fontWeight={400}
          className="truncate block max-w-[260px]"
        >
          {website.url}
        </Label>
      );
    case "country":
      return <CountryFlag country={website.trafficCountry} />;
    case "language":
      return (
        <Label fontSize={13} fontWeight={400} className="truncate">
          {getLanguageLabel(website.primaryLanguage)}
        </Label>
      );
    case "category":
      return (
        <Label fontSize={13} fontWeight={400} className="truncate">
          {website.mainCategory.length > 0 ? (
            <>{website.mainCategory}</>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </Label>
      );
    case "otherCategories":
      return (
        <Label fontSize={13} fontWeight={400} className="truncate">
          {website.otherCategories.length > 0 ? (
            <>{website.otherCategories[0]}</>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </Label>
      );
    case "greyNiches":
      return <GreyNichesIcons showAll={showAll} />;
    default:
      return null;
  }
};

const getRowClassName = (index: number, base = "") =>
  `${base} ${index % 2 === 0 ? STYLES.rowEven : STYLES.rowOdd}`;

export function WebsiteTable() {
  const router = useRouter();
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const {
    websites,
    pagination,
    getPaginatedWebsites,
    setCurrentPage,
    isLoading,
  } = useWebsiteStore();

  const currentWebsites = useMemo(
    () => getPaginatedWebsites(pagination.currentPage, pagination.itemsPerPage),
    [getPaginatedWebsites, pagination.currentPage, pagination.itemsPerPage]
  );

  const handleRowClick = useCallback(
    (websiteId: string) => {
      setIsNavigating(true);
      router.push(`/add-website/${websiteId}`);
    },
    [router]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const toggleColumnVisibility = useCallback(() => {
    setShowAllColumns((prev) => !prev);
  }, []);

  const getVisiblePages = useCallback(() => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        2,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }, [pagination]);

  const renderPaginationItems = useCallback(() => {
    const items = [];
    const { currentPage, totalPages } = pagination;

    items.push(
      <PaginationItem key="previous">
        <PaginationPrevious
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
      </PaginationItem>
    );

    const visiblePages = getVisiblePages();

    visiblePages.forEach((page, index) => {
      if (page === "...") {
        items.push(
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        const pageNumber = typeof page === "number" ? page : parseInt(page);
        items.push(
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(pageNumber)}
              isActive={currentPage === pageNumber}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    });

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
        />
      </PaginationItem>
    );

    return items;
  }, [pagination, handlePageChange, getVisiblePages]);

  const MobileFieldRenderer = React.memo<{
    label: string;
    children: React.ReactNode;
    className?: string;
  }>(({
    label,
    children,
    className = "",
  }) => (
    <div className={className}>
      <Label fontSize={12} fontWeight={600} textColor="muted">
        {label}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  ));
  MobileFieldRenderer.displayName = 'MobileFieldRenderer';

  const MobileCard = React.memo<{
    website: Website;
    index: number;
  }>(({ website, index }) => (
    <div
      className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-sm transition-shadow ${getRowClassName(
        index
      )}`}
      onClick={() => handleRowClick(website.id)}
    >
      <div className="space-y-3">
        <MobileFieldRenderer label="Website">
          <Label fontSize={14} fontWeight={400}>
            {website.url}
          </Label>
        </MobileFieldRenderer>

        <div className="grid grid-cols-2 gap-4">
          <MobileFieldRenderer label="Country">
            <div className="flex items-center gap-2">
              <Image
                src={getCountryFlagUrl(website.trafficCountry)}
                alt=""
                width={21}
                height={14}
                className="object-cover"
                role="presentation"
              />
              <Label fontSize={13} fontWeight={400}>
                {website.trafficCountry}
              </Label>
            </div>
          </MobileFieldRenderer>

          <MobileFieldRenderer label="Language">
            <Label fontSize={13} fontWeight={400}>
              {getLanguageLabel(website.primaryLanguage)}
            </Label>
          </MobileFieldRenderer>
        </div>

        <MobileFieldRenderer label="Category">
          <Label fontSize={13} fontWeight={400}>
            {website.mainCategory}
          </Label>
        </MobileFieldRenderer>

        {showAllColumns && (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <MobileFieldRenderer label="Other categories">
              <Label fontSize={13} fontWeight={400}>
                {website.otherCategories.length > 0 ? (
                  <>{website.otherCategories[0]}</>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </Label>
            </MobileFieldRenderer>

            <MobileFieldRenderer label="Grey niches">
              <GreyNichesIcons showAll />
            </MobileFieldRenderer>
          </div>
        )}
      </div>
    </div>
  ));
  MobileCard.displayName = 'MobileCard';

  if (isNavigating) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (websites.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-0">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <Label fontSize={24} fontWeight={600}>
          All websites
        </Label>
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <AddWebsiteButton />
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleColumnVisibility}
              className="flex items-center gap-2"
            >
              {showAllColumns ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showAllColumns ? "Hide details" : "Show details"}
            </Button>
          </div>
        </div>

        <div className="md:hidden space-y-4">
          {currentWebsites.map((website: Website, index: number) => (
            <MobileCard key={website.id} website={website} index={index} />
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <Table className="w-full min-w-[1200px]">
            <TableHeader>
              <TableRow
                className={`border-b border-gray-200 ${STYLES.headerBg}`}
              >
                {COLUMNS.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`text-left ${STYLES.cellPadding} tracking-wider ${column.width}`}
                  >
                    <Label fontSize={12} fontWeight={600} textColor="muted">
                      {column.label}
                    </Label>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentWebsites.map((website: Website, index: number) => (
                <TableRow
                  key={website.id}
                  className={getRowClassName(
                    index,
                    "cursor-pointer hover:cursor-pointer transition-colors border-b border-gray-100"
                  )}
                  onClick={() => handleRowClick(website.id)}
                >
                  {COLUMNS.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`${STYLES.cellPadding} ${column.width}`}
                    >
                      {renderCellContent(website, column.key, true)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {websites.length > 0 && (
          <div className="flex justify-center pt-4">
            <Pagination>
              <PaginationContent>{renderPaginationItems()}</PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}