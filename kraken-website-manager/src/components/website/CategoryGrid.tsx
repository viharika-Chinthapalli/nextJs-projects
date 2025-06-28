import React, { useCallback } from "react";
import { MAIN_CATEGORIES } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";

interface CategoryGridProps {
  selectedCategories: string[];
  onCategoriesSelect: (categories: string[]) => void;
}

export function CategoryGrid({
  selectedCategories,
  onCategoriesSelect,
}: CategoryGridProps) {
  const handleCategoryToggle = useCallback(
    (category: string) => {
      const newSelection = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];

      onCategoriesSelect(newSelection);
    },
    [selectedCategories, onCategoriesSelect]
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
        {MAIN_CATEGORIES.map((category, index) => {
          const isSelected = selectedCategories.includes(category);

          return (
            <div
              key={`${category}-${index}`}
              className="flex items-center gap-2 sm:gap-3 p-3 rounded-lg transition-all min-w-0"
            >
              <Checkbox
                id={`category-${category}`}
                checked={isSelected}
                onCheckedChange={() => handleCategoryToggle(category)}
                className="flex-shrink-0"
              />
              <Label
                htmlFor={`category-${category}`}
                fontWeight={isSelected ? 600 : 500}
                fontSize={14}
                textColor="muted"
                className="truncate block cursor-pointer select-none"
              >
                {category}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
