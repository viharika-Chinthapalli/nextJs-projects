"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import {
  UseFormReturn,
  FieldPath,
  FieldError,
  useFormState,
} from "react-hook-form";
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
  cryptoPrice?: {
    guestPosting?: number;
    linkInsertion?: number;
    currency?: string;
  };
  adultPrice?: {
    guestPosting?: number;
    linkInsertion?: number;
    currency?: string;
  };
  gamblingPrice?: {
    guestPosting?: number;
    linkInsertion?: number;
    currency?: string;
  };
  cryptoPrice2?: {
    guestPosting?: number;
    linkInsertion?: number;
    currency?: string;
  };
  adultPrice2?: {
    guestPosting?: number;
    linkInsertion?: number;
    currency?: string;
  };
  gamblingPrice2?: {
    guestPosting?: number;
    linkInsertion?: number;
    currency?: string;
  };
  homepageLink?: { price?: number; currency?: string };
  offerGuidelines?: string;
  samePrice?: "yes" | "no";
  samePriceValue?: number;
  articleSpecification: {
    includeArticle: boolean;
    clientProvidesContent: boolean;
    wordCount?: { min?: number; max?: number };
    taggingPolicy:
      | "no-tag"
      | "advertiser-request"
      | "always-tag"
      | "exact-match";
    linksToAdvertiser: {
      noTagged: boolean;
      minNumber?: number;
      maxNumber?: number;
    };
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
        textColor={disabled ? "custom" : "default"}
        customColor={disabled ? "#0F0C1B66" : undefined}
      >
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 sm:left-4.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
          <Image
            src={dollarIcon}
            width={12}
            height={12}
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
              if (value === "" || value === null || value === undefined)
                return undefined;
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
            color: "#0F0C1B66",
            opacity: disabled ? 0.6 : 1,
            borderColor: fieldError
              ? "#FF4D4F"
              : disabled
              ? "#E5E5E5"
              : "#EAEAEA",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min="0"
          step="0.01"
        />
        {fieldError && (
          <p className="text-xs text-red-500 mt-1">{fieldError.message}</p>
        )}
      </div>
    </div>
  );
};

PriceInput.displayName = "PriceInput";

const SamePriceInput = React.memo<{
  placeholder?: string;
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}>(({ placeholder = "", disabled = false, value, onChange, inputRef }) => {
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
        <div className="absolute left-3 sm:left-4.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
          <Image 
            src={dollarIcon} 
            width={12} 
            height={12} 
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
          ref={inputRef}
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-10 sm:pl-14 pr-3 py-2 rounded-md bg-white focus:outline-none transition-shadow text-sm sm:text-base min-h-[44px] ${
            disabled ? "bg-gray-50 cursor-not-allowed" : ""
          }`}
          style={{
            boxShadow: "none",
            color: "#0F0C1B66",
            opacity: disabled ? 0.6 : 1,
            borderColor: disabled ? "#E5E5E5" : "#EAEAEA",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
});
SamePriceInput.displayName = "SamePriceInput";

const CreateOffer: React.FC<CreateOfferProps> = ({ form }) => {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = form;

  const [activeTab, setActiveTab] = useState<
    "normal" | "grey-niche" | "homepage-link"
  >("normal");

  const [localSamePriceValue, setLocalSamePriceValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const samePrice = watch("samePrice") || "no";
  const samePriceValue = watch("samePriceValue");
  const offerGuidelines = watch("offerGuidelines") || "";

  useEffect(() => {
    if (samePriceValue !== undefined) {
      setLocalSamePriceValue(samePriceValue.toString());
    } else {
      setLocalSamePriceValue("");
    }
  }, [samePriceValue]);

  useEffect(() => {
    setValue("offerType", activeTab);
  }, [activeTab, setValue]);

  const handleSamePriceToggle = useCallback(
    (checked: boolean) => {
      const newValue = checked ? "yes" : "no";
      setValue("samePrice", newValue, { shouldValidate: true, shouldDirty: true });
      if (newValue === "no") {
        setValue("samePriceValue", undefined, { shouldValidate: true, shouldDirty: true });
        setLocalSamePriceValue("");
      }
    },
    [setValue]
  );

  const priceFields = useMemo(() => [
    {
      guestPostingPath: "cryptoPrice.guestPosting" as FieldPath<WebsiteFormData>,
      linkInsertionPath: "cryptoPrice.linkInsertion" as FieldPath<WebsiteFormData>,
    },
    {
      guestPostingPath: "adultPrice.guestPosting" as FieldPath<WebsiteFormData>,
      linkInsertionPath: "adultPrice.linkInsertion" as FieldPath<WebsiteFormData>,
    },
    {
      guestPostingPath: "gamblingPrice.guestPosting" as FieldPath<WebsiteFormData>,
      linkInsertionPath: "gamblingPrice.linkInsertion" as FieldPath<WebsiteFormData>,
    },
    {
      guestPostingPath: "cryptoPrice2.guestPosting" as FieldPath<WebsiteFormData>,
      linkInsertionPath: "cryptoPrice2.linkInsertion" as FieldPath<WebsiteFormData>,
    },
    {
      guestPostingPath: "adultPrice2.guestPosting" as FieldPath<WebsiteFormData>,
      linkInsertionPath: "adultPrice2.linkInsertion" as FieldPath<WebsiteFormData>,
    },
    {
      guestPostingPath: "gamblingPrice2.guestPosting" as FieldPath<WebsiteFormData>,
      linkInsertionPath: "gamblingPrice2.linkInsertion" as FieldPath<WebsiteFormData>,
    },
  ], []);

  const updateFormValuesRef = useRef<NodeJS.Timeout | null>(null);

  const handleSamePriceValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSamePriceValue(value);

      if (updateFormValuesRef.current) {
        clearTimeout(updateFormValuesRef.current);
      }

      updateFormValuesRef.current = setTimeout(() => {
        const num = value === "" ? undefined : Number(value);
        const validNum = value === "" || isNaN(num as number) ? undefined : num;

        setValue("samePriceValue", validNum, { 
          shouldValidate: true, 
          shouldDirty: true 
        });

        if (samePrice === "yes" && validNum !== undefined && validNum >= 0) {
          priceFields.forEach(({ guestPostingPath, linkInsertionPath }) => {
            setValue(guestPostingPath, validNum, { 
              shouldValidate: true, 
              shouldDirty: true 
            });
            setValue(linkInsertionPath, validNum, { 
              shouldValidate: true, 
              shouldDirty: true 
            });
          });
        }

        trigger();
      }, 100);
    },
    [samePrice, setValue, priceFields, trigger]
  );

  useEffect(() => {
    return () => {
      if (updateFormValuesRef.current) {
        clearTimeout(updateFormValuesRef.current);
      }
    };
  }, []);

  const handleOfferGuidelinesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue("offerGuidelines", e.target.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const tabs = useMemo(
    () => [
      { key: "normal", label: "Normal offer" },
      { key: "grey-niche", label: "Grey Niche offer" },
      { key: "homepage-link", label: "Homepage link" },
    ],
    []
  );

  const renderGreyNicheSection = useCallback((
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
              name={
                `${gamblingPricePrefix}.guestPosting` as FieldPath<WebsiteFormData>
              }
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
            <PriceInput
              label="Price for Link Insertion"
              name={
                `${gamblingPricePrefix}.linkInsertion` as FieldPath<WebsiteFormData>
              }
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
              name={
                `${cryptoPricePrefix}.guestPosting` as FieldPath<WebsiteFormData>
              }
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
            <PriceInput
              label="Price for Link Insertion"
              name={
                `${cryptoPricePrefix}.linkInsertion` as FieldPath<WebsiteFormData>
              }
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
              name={
                `${adultPricePrefix}.guestPosting` as FieldPath<WebsiteFormData>
              }
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
            <PriceInput
              label="Price for Link Insertion"
              name={
                `${adultPricePrefix}.linkInsertion` as FieldPath<WebsiteFormData>
              }
              placeholder="0"
              disabled={samePrice === "yes"}
              form={form}
            />
          </div>
        </div>
      </div>
    </div>
  ), [samePrice, form]);

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
              <div className="bg-white rounded-lg">
                <div className="">
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
                  <div className="mt-6 mb-6 sm:mb-8 w-full max-w-xs">
                    <SamePriceInput
                      value={localSamePriceValue}
                      onChange={handleSamePriceValueChange}
                      placeholder=""
                      inputRef={inputRef}
                    />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg">
                {renderGreyNicheSection(
                  "First Row",
                  "cryptoPrice" as FieldPath<WebsiteFormData>,
                  "adultPrice" as FieldPath<WebsiteFormData>,
                  "gamblingPrice" as FieldPath<WebsiteFormData>
                )}
              </div>

              <div className="bg-white rounded-lg">
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
                      Offer Guidelines
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