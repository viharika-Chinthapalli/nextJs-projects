import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryGrid } from "../CategoryGrid";
import { LANGUAGES, COUNTRIES } from "@/lib/constants";
import { WebsiteFormData } from "@/lib/validations";
import { getCountryFlagUrl, getLanguageFlagUrl } from "@/lib/utils";

interface WebsiteDetailsProps {
  form: UseFormReturn<WebsiteFormData>;
}

export function WebsiteDetails({ form }: WebsiteDetailsProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    trigger,
    clearErrors,
  } = form;

  const formData = watch();

  const [dropdowns, setDropdowns] = useState({
    language: false,
    country: false,
  });

  useEffect(() => {
    const currentLanguage = getValues("primaryLanguage");
    const currentCountry = getValues("trafficCountry");

    if (!currentLanguage && LANGUAGES.length > 0) {
      setValue("primaryLanguage", LANGUAGES[0].value);
    }
    if (!currentCountry && COUNTRIES.length > 0) {
      setValue("trafficCountry", COUNTRIES[0].value);
    }
  }, [setValue, getValues]);

  const updateField = useCallback(
    (field: keyof WebsiteFormData, value: WebsiteFormData[keyof WebsiteFormData]) => {
      setValue(field, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (value && value !== "") {
        clearErrors(field);
      }
    },
    [setValue, clearErrors]
  );

  const toggleDropdown = useCallback((dropdown: "language" | "country") => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  }, []);

  const closeDropdowns = useCallback(() => {
    setDropdowns({ language: false, country: false });
  }, []);

  const selectedLanguage = useMemo(() => {
    return LANGUAGES.find((lang) => lang.value === formData.primaryLanguage);
  }, [formData.primaryLanguage]);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find(
      (country) => country.value === formData.trafficCountry
    );
  }, [formData.trafficCountry]);

  const handleLanguageSelect = useCallback(
    (value: string) => {
      updateField("primaryLanguage", value);
      closeDropdowns();
    },
    [updateField, closeDropdowns]
  );

  const handleCountrySelect = useCallback(
    (value: string) => {
      updateField("trafficCountry", value);
      closeDropdowns();
    },
    [updateField, closeDropdowns]
  );

  const handleCategoriesSelect = useCallback(
    (categories: string[]) => {
      updateField(
        "mainCategory",
        categories.length > 0 ? categories[0] : ""
      );
      updateField("otherCategories", categories.slice(1));
    },
    [updateField]
  );

  const allSelectedCategories = useMemo(() => {
    const categories = [];
    if (formData.mainCategory) {
      categories.push(formData.mainCategory);
    }
    if (formData.otherCategories) {
      categories.push(...formData.otherCategories);
    }
    return categories;
  }, [formData.mainCategory, formData.otherCategories]);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      updateField("description", value);
    },
    [updateField]
  );

  return (
    <>
      <Label fontWeight={600} fontSize={24} className="mt-20">
        Website detail
      </Label>

      <Card>
        <CardContent className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full lg:w-4/5 xl:w-3/4">
            <div className="space-y-2">
              <Label fontWeight={500} fontSize={14}>
                Enter website
              </Label>
              <Input
                {...register("url", {
                  required: "Website URL is required",
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                    message: "Please enter a valid URL"
                  }
                })}
                placeholder="Website URL"
                fontSize="14px"
                fontWeight="500"
                fontColor="#0F0C1B"
                placeholderColor="#0F0C1B66"
                placeholderSize="14px"
                placeholderWeight="500"
                error={errors.url?.message || ""}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label fontWeight={500} fontSize={14}>
                Website&apos;s Primary language
              </Label>
              <Select>
                <SelectTrigger
                  onClick={() => toggleDropdown("language")}
                  isActive={dropdowns.language}
                  className="w-full"
                  error={errors.primaryLanguage?.message} 
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    {selectedLanguage && (
                      <Image
                        src={getLanguageFlagUrl(selectedLanguage)}
                        alt="Language Flag"
                        width={24}
                        height={16}
                        className="object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://flagcdn.com/w40/un.png";
                        }}
                      />
                    )}
                    <SelectValue placeholder="Select language">
                      <span className="truncate">
                        {selectedLanguage?.label || "Select language"}
                      </span>
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent
                  isOpen={dropdowns.language}
                  onClose={closeDropdowns}
                >
                  {LANGUAGES.map((language) => (
                    <SelectItem
                      key={language.value}
                      value={language.value}
                      onClick={handleLanguageSelect}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Image
                          src={getLanguageFlagUrl(language)}
                          alt={language.label}
                          width={24}
                          height={16}
                          className="object-cover flex-shrink-0"
                          style={{ width: "24px", height: "16px" }}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://flagcdn.com/w40/un.png";
                          }}
                        />
                        <span className="truncate">{language.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label fontWeight={500} fontSize={14}>
                Your Majority of traffic comes from
              </Label>
              <Select>
                <SelectTrigger
                  onClick={() => toggleDropdown("country")}
                  isActive={dropdowns.country}
                  className="w-full"
                  error={errors.trafficCountry?.message}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    {selectedCountry && (
                      <Image
                        src={getCountryFlagUrl(selectedCountry)}
                        alt="Country Flag"
                        width={24}
                        height={16}
                        className="object-cover flex-shrink-0"
                        style={{ width: "24px", height: "16px" }}
                      />
                    )}
                    <SelectValue placeholder="Select country">
                      <span className="truncate">
                        {selectedCountry?.label || "Select country"}
                      </span>
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent
                  isOpen={dropdowns.country}
                  onClose={closeDropdowns}
                >
                  {COUNTRIES.map((country) => (
                    <SelectItem
                      key={country.value}
                      value={country.value}
                      onClick={handleCountrySelect}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Image
                          src={getCountryFlagUrl(country)}
                          alt={country.label}
                          width={24}
                          height={16}
                          className="object-cover flex-shrink-0"
                          style={{ width: "24px", height: "16px" }}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://flagcdn.com/w40/un.png";
                          }}
                        />
                        <span className="truncate">{country.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label fontWeight={500} fontSize={14}>
              Main Category
            </Label>
            <CategoryGrid
              selectedCategories={allSelectedCategories}
              onCategoriesSelect={handleCategoriesSelect}
            />
          </div>

          <div className="space-y-2 w-full lg:w-4/5 xl:w-3/4">
            <Label fontWeight={500} fontSize={14}>
              Description of Website
            </Label>
            <Textarea
              id="description"
              placeholder="Description"
              rows={4}
              value={formData.description || ""}
              onChange={handleDescriptionChange}
              className={`w-full ${errors.description ? "border-red-500" : ""}`}
              error={errors.description?.message || ""}
              onBlur={() => {
                trigger("description");
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isOwner"
              {...register("isOwner")}
              checked={formData.isOwner || false}
              onCheckedChange={(checked) => updateField("isOwner", !!checked)}
            />
            <Label fontWeight={500} fontSize={14}>
              I am the owner of the website
            </Label>
          </div>
        </CardContent>
      </Card>
    </>
  );
}