"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { UseFormReturn, FieldPath, FieldError, useFormState } from "react-hook-form";
import dollarIcon from "../../../../public/add-website-icons/dollar-icon.svg";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WebsiteFormData {
  url: string;
  primaryLanguage: string;
  trafficCountry: string;
  mainCategory: string;
  otherCategories: string[];
  description: string;
  isOwner: boolean;
  offerType: "normal" | "grey-niche" | "homepage-link";
  guestPosting: { price?: number; currency: string };
  linkInsertion: { price?: number; currency: string };
  cryptoPrice?: { guestPosting?: number; linkInsertion?: number; currency?: string };
  adultPrice?: { guestPosting?: number; linkInsertion?: number; currency?: string };
  gamblingPrice?: { guestPosting?: number; linkInsertion?: number; currency?: string };
  cryptoPrice2?: { guestPosting?: number; linkInsertion?: number; currency?: string };
  adultPrice2?: { guestPosting?: number; linkInsertion?: number; currency?: string };
  gamblingPrice2?: { guestPosting?: number; linkInsertion?: number; currency?: string };
  homepageLink?: { price?: number; currency?: string };
  offerGuidelines?: string;
  samePrice?: "yes" | "no";
  samePriceValue?: number;
  articleSpecification: {
    includeArticle: boolean;
    clientProvidesContent: boolean;
    wordCount?: { min?: number; max?: number };
    taggingPolicy: "no-tag" | "advertiser-request" | "always-tag" | "exact-match";
    linksToAdvertiser: { noTagged: boolean; minNumber?: number; maxNumber?: number };
    allowDoFollow: boolean;
    linkTypes: {
      brandedLinks: boolean;
      urlNavigational: boolean;
      genericLinks: boolean;
      exactMatchAnchors: boolean;
    };
    otherLinks: { allowOtherLinks: boolean; description: string };
    otherRules: string;
  };
}

interface CreateOfferProps {
  form: UseFormReturn<WebsiteFormData>;
}

interface PriceInputProps {
  label: string;
  name: FieldPath<WebsiteFormData>;
  placeholder?: string;
  disabled?: boolean;
  form: UseFormReturn<WebsiteFormData>;
  className?: string;
}

const PriceInput: React.FC<PriceInputProps> = ({
  label,
  name,
  placeholder = "",
  disabled = false,
  form,
  className = "",
}) => {
  const { register, control } = form;
  const { errors } = useFormState({ control });

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!disabled) {
        e.target.style.boxShadow = "0px 0px 0px 2px #613FDD20";
      }
    },
    [disabled]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = "none";
  }, []);

  const fieldError = name
    .split(".")
    .reduce((acc: Record<string, unknown> | undefined, key: string) => {
      if (acc && typeof acc === "object" && key in acc) {
        return acc[key] as Record<string, unknown> | undefined;
      }
      return undefined;
    }, errors as Record<string, unknown> | undefined) as FieldError | undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label
        fontSize={14}
        fontWeight={500}
        textColor={disabled ? "custom" : "muted"}
        customColor={disabled ? "#0F0C1B66" : undefined}
      >
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 sm:left-4.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
          <Image
            src={dollarIcon}
            width={14}
            height={14}
            alt="dollarIcon"
            style={{
              opacity: disabled ? 0.6 : 1,
              filter: disabled ? "grayscale(1)" : "none",
            }}
          />
        </div>

        <div
          className="absolute left-8 sm:left-12 top-1/2 transform -translate-y-1/2 h-8 sm:h-10 w-px pointer-events-none"
          style={{ backgroundColor: disabled ? "#E5E5E5" : "#EAEAEA" }}
        ></div>

        <input
          type="number"
          placeholder={placeholder}
          {...register(name, {
            setValueAs: (value: string | number | null | undefined) => {
              if (value === "" || value === null || value === undefined) return undefined;
              const num = Number(value);
              return isNaN(num) ? undefined : num;
            },
            disabled,
          })}
          className={`w-full pl-10 sm:pl-14 pr-3 py-2 rounded-md bg-white focus:outline-none transition-shadow text-sm sm:text-base min-h-[44px] ${
            disabled ? "bg-gray-50 cursor-not-allowed" : ""
          }`}
          style={{
            boxShadow: "none",
            color: disabled ? "#0F0C1B66" : "#0F0C1B",
            borderColor: fieldError ? "#FF4D4F" : disabled ? "#E5E5E5" : "#EAEAEA",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min="0"
          step="0.01"
        />
        {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError.message}</p>}
      </div>
    </div>
  );
};

PriceInput.displayName = "PriceInput";

const CreateOffer: React.FC<CreateOfferProps> = ({ form }) => {
  const {
    setValue,
    formState: { errors },
  } = form;

  const [activeTab, setActiveTab] = useState<"normal" | "grey-niche" | "homepage-link">("normal");

  const samePrice = form.watch("samePrice") || "no";
  const samePriceValue = form.watch("samePriceValue");
  const offerGuidelines = form.watch("offerGuidelines") || "";

  useEffect(() => {
    setValue("offerType", activeTab);
  }, [activeTab, setValue]);

  const handleSamePriceToggle = useCallback(
    (checked: boolean) => {
      const newValue = checked ? "yes" : "no";
      setValue("samePrice", newValue);
      if (newValue === "no") setValue("samePriceValue", undefined);
    },
    [setValue]
  );

  const handleSamePriceValueChange = useCallback(
    (value: string) => {
      const num = Number(value);
      const valid = value === "" || isNaN(num) ? undefined : num;
      setValue("samePriceValue", valid);

      if (samePrice === "yes" && valid !== undefined && valid >= 0) {
        const priceFields: (keyof WebsiteFormData)[] = [
          "cryptoPrice",
          "adultPrice",
          "gamblingPrice",
          "cryptoPrice2",
          "adultPrice2",
          "gamblingPrice2",
        ];

        priceFields.forEach((field) => {
          setValue(`${field}.guestPosting` as FieldPath<WebsiteFormData>, valid);
          setValue(`${field}.linkInsertion` as FieldPath<WebsiteFormData>, valid);
        });
      }
    },
    [samePrice, setValue]
  );

  const handleOfferGuidelinesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue("offerGuidelines", e.target.value, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  useEffect(() => {
    if (samePrice === "yes" && samePriceValue !== undefined && samePriceValue > 0) {
      const priceFields: (keyof WebsiteFormData)[] = [
        "cryptoPrice",
        "adultPrice",
        "gamblingPrice",
        "cryptoPrice2",
        "adultPrice2",
        "gamblingPrice2",
      ];

      priceFields.forEach((field) => {
        setValue(`${field}.guestPosting` as FieldPath<WebsiteFormData>, samePriceValue);
        setValue(`${field}.linkInsertion` as FieldPath<WebsiteFormData>, samePriceValue);
      });
    }
  }, [samePrice, samePriceValue, setValue]);

  const tabs = useMemo(
    () => [
      { key: "normal", label: "Normal offer" },
      { key: "grey-niche", label: "Grey Niche offer" },
      { key: "homepage-link", label: "Homepage link" },
    ],
    []
  );

  interface SamePriceInputProps {
    placeholder?: string;
    disabled?: boolean;
    value: number | undefined;
    onChange: (value: string) => void;
  }

  const SamePriceInput: React.FC<SamePriceInputProps> = React.memo(
    ({ placeholder = "", disabled = false, value, onChange }) => {
      const handleFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
          if (!disabled) {
            e.target.style.boxShadow = "0px 0px 0px 2px #613FDD20";
          }
        },
        [disabled]
      );

      const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
          e.target.style.boxShadow = "none";
        },
        []
      );

      return (
        <div className="space-y-2">
          <Label fontWeight={500} fontSize={14}>
            Enter Price
          </Label>
          <div className="relative">
            <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              <Image src={dollarIcon} width={12} height={12} alt="dollarIcon" />
            </div>
            <div className="absolute left-6 sm:left-6 top-1/2 transform -translate-y-1/2 h-4 w-px bg-[#EAEAEA] pointer-events-none"></div>
            <input
              type="number"
              placeholder={placeholder}
              value={value !== undefined ? value : ""}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={`
              w-full
              pl-8 sm:pl-10
              pr-3
              py-2
              rounded-md
              bg-white
              text-[#0F0C1B66]
              placeholder-[#0F0C1B66]
              focus:outline-none
              transition-shadow
              border border-[#EAEAEA]
              text-sm sm:text-base
              min-h-[44px]
              ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}
            `}
              style={{
                boxShadow: "none",
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      );
    }
  );

  SamePriceInput.displayName = "SamePriceInput";

  const renderGreyNicheSection = (
    title: string,
    cryptoPricePrefix: FieldPath<WebsiteFormData>,
    adultPricePrefix: FieldPath<WebsiteFormData>,
    gamblingPricePrefix: FieldPath<WebsiteFormData>
  ) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-4">
          <Label
            className="mb-2 sm:mb-4 block"
            fontSize={16}
            fontWeight={600}
            textColor={samePrice === "yes" ? "custom" : "muted"}
            customColor={samePrice === "yes" ? "#0F0C1B66" : undefined}
          >
            Gambling
          </Label>
          <div className="space-y-3 sm:space-y-4">
            <PriceInput
              label="Price for Guest Posting"
              name={`${gamblingPricePrefix}.guestPosting` as FieldPath<WebsiteFormData>}
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
            <PriceInput
              label="Price for Link Insertion"
              name={`${gamblingPricePrefix}.linkInsertion` as FieldPath<WebsiteFormData>}
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label
            className="mb-2 sm:mb-4 block"
            fontSize={16}
            fontWeight={600}
            textColor={samePrice === "yes" ? "custom" : "muted"}
            customColor={samePrice === "yes" ? "#0F0C1B66" : undefined}
          >
            Crypto
          </Label>
          <div className="space-y-3 sm:space-y-4">
            <PriceInput
              label="Price for Guest Posting"
              name={`${cryptoPricePrefix}.guestPosting` as FieldPath<WebsiteFormData>}
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
            <PriceInput
              label="Price for Link Insertion"
              name={`${cryptoPricePrefix}.linkInsertion` as FieldPath<WebsiteFormData>}
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
          </div>
        </div>

        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Label
            className="mb-2 sm:mb-4 block"
            fontSize={16}
            fontWeight={600}
            textColor={samePrice === "yes" ? "custom" : "muted"}
            customColor={samePrice === "yes" ? "#0F0C1B66" : undefined}
          >
            Adult
          </Label>
          <div className="space-y-3 sm:space-y-4">
            <PriceInput
              label="Price for Guest Posting"
              name={`${adultPricePrefix}.guestPosting` as FieldPath<WebsiteFormData>}
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
            <PriceInput
              label="Price for Link Insertion"
              name={`${adultPricePrefix}.linkInsertion` as FieldPath<WebsiteFormData>}
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Label fontWeight={600} fontSize={24} className="mb-5 mt-20">
        Create offer
      </Label>

      <Card>
        <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <div
              className="flex border-b overflow-x-auto"
              style={{ borderColor: "#B3B3B3" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-3 sm:px-6 py-3 transition-colors whitespace-nowrap text-sm sm:text-base min-w-fit font-semibold ${
                    activeTab === tab.key ? "border-b-2" : ""
                  }`}
                  style={{
                    color: activeTab === tab.key ? "#0F0C1B" : "#0F0C1B66",
                    borderBottomColor:
                      activeTab === tab.key ? "#613FDD" : "transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "normal" && (
            <div className="space-y-6 sm:space-y-8 w-full max-w-none sm:max-w-[70%] lg:max-w-[50%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <PriceInput
                  label="Guest posting"
                  name="guestPosting.price"
                  placeholder="0"
                  form={form}
                />
                <PriceInput
                  label="Link insertion"
                  name="linkInsertion.price"
                  placeholder="0"
                  form={form}
                />
              </div>
            </div>
          )}

          {activeTab === "grey-niche" && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleSamePriceToggle(samePrice !== "yes")}
                      className={cn(
                        "h-4 w-4 rounded-full border transition-all duration-200 flex items-center justify-center",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#613FDD] focus-visible:ring-offset-2",
                        samePrice === "yes"
                          ? "border-[#613FDD] bg-white"
                          : "border-[#EAEAEA] bg-transparent"
                      )}
                    >
                      {samePrice === "yes" && (
                        <div className="h-2 w-2 rounded-full bg-[#613FDD]" />
                      )}
                    </button>
                    <span
                      onClick={() => handleSamePriceToggle(samePrice !== "yes")}
                    >
                      <Label
                        fontSize={14}
                        fontWeight={500}
                        textColor="muted"
                        className="cursor-pointer text-sm sm:text-base"
                      >
                        I offer same price for all grey niches
                      </Label>
                    </span>
                  </div>
                </div>

                {samePrice === "yes" && (
                  <div className="mb-6 sm:mb-8 w-full max-w-xs">
                    <SamePriceInput
                      value={samePriceValue}
                      onChange={handleSamePriceValueChange}
                      placeholder=""
                    />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6">
                {renderGreyNicheSection(
                  "First Row",
                  "cryptoPrice" as FieldPath<WebsiteFormData>,
                  "adultPrice" as FieldPath<WebsiteFormData>,
                  "gamblingPrice" as FieldPath<WebsiteFormData>
                )}
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6">
                {renderGreyNicheSection(
                  "Second Row",
                  "cryptoPrice2" as FieldPath<WebsiteFormData>,
                  "adultPrice2" as FieldPath<WebsiteFormData>,
                  "gamblingPrice2" as FieldPath<WebsiteFormData>
                )}
              </div>
            </div>
          )}

          {activeTab === "homepage-link" && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6 w-full max-w-none sm:max-w-sm">
                  <PriceInput
                    label="Price"
                    name="homepageLink.price"
                    placeholder="0"
                    form={form}
                  />

                  <div className="space-y-2">
                    <Label fontSize={14} fontWeight={500}>
                      Offer Guidelines (Optional)
                    </Label>
                    <Textarea
                      placeholder="Description"
                      rows={4}
                      value={offerGuidelines}
                      onChange={handleOfferGuidelinesChange}
                      error={errors.offerGuidelines?.message || ""}
                      className="w-full min-h-[100px] text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default CreateOffer;