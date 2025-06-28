import { z } from "zod";

export const websiteFormSchema = z
  .object({
    url: z.string().min(1, "Enter Valid Website").url("Enter Valid Website"),
    primaryLanguage: z.string().min(1, "Primary language is required"),
    trafficCountry: z.string().min(1, "Traffic country is required"),
    mainCategory: z.string(z.string()),
    otherCategories: z.array(z.string()),
    description: z
      .string()
      .min(1, "Description is required")
      .min(150, "Description must be at least 150 characters long"),
    isOwner: z.boolean(),
    offerType: z.enum(["normal", "grey-niche", "homepage-link"]),
    guestPosting: z.object({
      price: z.number().min(0, "Price cannot be negative").optional(),
      currency: z.string().min(1, "Currency is required"),
    }),
    linkInsertion: z.object({
      price: z.number().min(0, "Price cannot be negative").optional(),
      currency: z.string().min(1, "Currency is required"),
    }),
    cryptoPrice: z
      .object({
        guestPosting: z.number().min(0, "Price cannot be negative").optional(),
        linkInsertion: z.number().min(0, "Price cannot be negative").optional(),
        currency: z.string().optional(),
      })
      .optional(),
    adultPrice: z
      .object({
        guestPosting: z.number().min(0, "Price cannot be negative").optional(),
        linkInsertion: z.number().min(0, "Price cannot be negative").optional(),
        currency: z.string().optional(),
      })
      .optional(),
    gamblingPrice: z
      .object({
        guestPosting: z.number().min(0, "Price cannot be negative").optional(),
        linkInsertion: z.number().min(0, "Price cannot be negative").optional(),
        currency: z.string().optional(),
      })
      .optional(),
    cryptoPrice2: z
      .object({
        guestPosting: z.number().min(0, "Price cannot be negative").optional(),
        linkInsertion: z.number().min(0, "Price cannot be negative").optional(),
        currency: z.string().optional(),
      })
      .optional(),
    adultPrice2: z
      .object({
        guestPosting: z.number().min(0, "Price cannot be negative").optional(),
        linkInsertion: z.number().min(0, "Price cannot be negative").optional(),
        currency: z.string().optional(),
      })
      .optional(),
    gamblingPrice2: z
      .object({
        guestPosting: z.number().min(0, "Price cannot be negative").optional(),
        linkInsertion: z.number().min(0, "Price cannot be negative").optional(),
        currency: z.string().optional(),
      })
      .optional(),
    homepageLink: z
      .object({
        price: z.number().min(0, "Price cannot be negative").optional(),
        currency: z.string().optional(),
      })
      .optional(),
    offerGuidelines: z
      .string()
      .min(1, "Offer guidelines are required when provided")
      .max(1000, "Offer guidelines must be less than 1000 characters")
      .optional()
      .or(z.literal("")),
    samePrice: z.enum(["yes", "no"]).optional(),
    samePriceValue: z.number().min(0, "Price cannot be negative").optional(),
    articleSpecification: z.object({
      includeArticle: z.boolean(),
      clientProvidesContent: z.boolean(),
      wordCount: z
        .object({
          min: z
            .number()
            .min(1, "Minimum word count must be at least 1")
            .optional(),
          max: z
            .number()
            .min(1, "Maximum word count must be at least 1")
            .optional(),
        })
        .optional(),
      taggingPolicy: z.enum([
        "no-tag",
        "advertiser-request",
        "always-tag",
        "exact-match",
      ]),
      linksToAdvertiser: z
        .object({
          noTagged: z.boolean(),
          minNumber: z
            .number()
            .min(0, "Minimum number must be 0 or greater")
            .optional(),
          maxNumber: z
            .number()
            .min(0, "Maximum number must be 0 or greater")
            .optional(),
        }),
      allowDoFollow: z.boolean(),
      linkTypes: z.object({
        brandedLinks: z.boolean(),
        urlNavigational: z.boolean(),
        genericLinks: z.boolean(),
        exactMatchAnchors: z.boolean(),
      }),
      otherLinks: z.object({
        allowOtherLinks: z.boolean(),
        description: z.string(),
      }),
      otherRules: z.string(),
    }),
  })
  .refine(
    (data) => {
      if (data.articleSpecification.clientProvidesContent === false) {
        const wordCount = data.articleSpecification.wordCount;
        if (wordCount?.min === undefined || wordCount?.max === undefined) {
          return false;
        }
        return wordCount.max >= wordCount.min;
      }
      return true;
    },
    {
      message: "Both minimum and maximum word count are required",
      path: ["articleSpecification", "wordCount"],
    }
  )
  .refine(
    (data) => {
      if (data.articleSpecification.linksToAdvertiser.noTagged === false) {
        const linkNumbers = data.articleSpecification.linksToAdvertiser;
        if (linkNumbers.minNumber === undefined || linkNumbers.maxNumber === undefined) {
          return false;
        }
        return linkNumbers.maxNumber >= linkNumbers.minNumber;
      }
      return true;
    },
    {
      message: "Both minimum and maximum number of links are required",
      path: ["articleSpecification", "linksToAdvertiser"],
    }
  )
  .refine(
    (data) => {
      if (data.articleSpecification.clientProvidesContent === false) {
        const wordCount = data.articleSpecification.wordCount;
        if (wordCount?.min !== undefined && wordCount?.max !== undefined) {
          return wordCount.max >= wordCount.min;
        }
      }
      return true;
    },
    {
      message: "Maximum word count must be greater than or equal to minimum",
      path: ["articleSpecification", "wordCount", "max"],
    }
  )
  .refine(
    (data) => {
      if (data.articleSpecification.linksToAdvertiser.noTagged === false) {
        const linkNumbers = data.articleSpecification.linksToAdvertiser;
        if (
          linkNumbers.minNumber !== undefined &&
          linkNumbers.maxNumber !== undefined
        ) {
          return linkNumbers.maxNumber >= linkNumbers.minNumber;
        }
      }
      return true;
    },
    {
      message:
        "Maximum number of links must be greater than or equal to minimum",
      path: ["articleSpecification", "linksToAdvertiser", "maxNumber"],
    }
  )
  .refine(
    (data) => {
      if (data.offerType === "homepage-link" && data.offerGuidelines !== undefined && data.offerGuidelines.trim() === "") {
        return true;
      }
      return true;
    },
    {
      message: "Offer guidelines are optional for homepage links",
      path: ["offerGuidelines"],
    }
  );

export interface WebsiteFormData {
  url: string;
  primaryLanguage: string;
  trafficCountry: string;
  mainCategory: string;
  otherCategories: string[];
  description: string;
  isOwner: boolean;
  offerType: "normal" | "grey-niche" | "homepage-link";
  guestPosting: {
    price?: number;
    currency: string;
  };
  linkInsertion: {
    price?: number;
    currency: string;
  };
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
  homepageLink?: {
    price?: number;
    currency?: string;
  };
  offerGuidelines?: string;
  samePrice?: "yes" | "no";
  samePriceValue?: number;
  articleSpecification: {
    includeArticle: boolean;
    clientProvidesContent: boolean;
    wordCount?: {
      min?: number;
      max?: number;
    };
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
    otherLinks: {
      allowOtherLinks: boolean;
      description: string;
    };
    otherRules: string;
  };
}

export interface Website extends WebsiteFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}