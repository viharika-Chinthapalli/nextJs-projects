"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { WebsiteFormData } from "@/lib/validations";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ArticleSpecificationProps {
  form: UseFormReturn<WebsiteFormData>;
}

export function ArticleSpecification({ form }: ArticleSpecificationProps) {
  const {
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = form;

  const includeArticle = watch("articleSpecification.includeArticle");
  const clientProvidesContent = watch(
    "articleSpecification.clientProvidesContent"
  );
  const taggingPolicy = watch("articleSpecification.taggingPolicy");
  const noTaggedLinks = watch(
    "articleSpecification.linksToAdvertiser.noTagged"
  );
  const allowOtherLinks = watch(
    "articleSpecification.otherLinks.allowOtherLinks"
  );
  const allowDoFollow = watch("articleSpecification.allowDoFollow");
  const brandedLinks = watch("articleSpecification.linkTypes.brandedLinks");
  const urlNavigational = watch(
    "articleSpecification.linkTypes.urlNavigational"
  );
  const genericLinks = watch("articleSpecification.linkTypes.genericLinks");
  const exactMatchAnchors = watch(
    "articleSpecification.linkTypes.exactMatchAnchors"
  );
  const wordCountMin = watch("articleSpecification.wordCount.min");
  const wordCountMax = watch("articleSpecification.wordCount.max");
  const linksMin = watch("articleSpecification.linksToAdvertiser.minNumber");
  const linksMax = watch("articleSpecification.linksToAdvertiser.maxNumber");

  const getCurrentLinkType = () => {
    if (brandedLinks) return "brandedLinks";
    if (urlNavigational) return "urlNavigational";
    if (genericLinks) return "genericLinks";
    if (exactMatchAnchors) return "exactMatchAnchors";
    return "";
  };

  const shouldShowWordCount = clientProvidesContent === false;
  const shouldShowLinkNumbers = noTaggedLinks === false;

  const getWordCountMinError = () => {
    return (
      errors.articleSpecification?.wordCount?.min?.message ||
      (errors.articleSpecification?.wordCount?.message && !wordCountMin
        ? "Minimum word count is required"
        : "")
    );
  };

  const getWordCountMaxError = () => {
    return (
      errors.articleSpecification?.wordCount?.max?.message ||
      (errors.articleSpecification?.wordCount?.message && !wordCountMax
        ? "Maximum word count is required"
        : "")
    );
  };

  const getLinksMinError = () => {
    return (
      errors.articleSpecification?.linksToAdvertiser?.minNumber?.message ||
      (errors.articleSpecification?.linksToAdvertiser?.message &&
      linksMin === undefined
        ? "Minimum number of links is required"
        : "")
    );
  };

  const getLinksMaxError = () => {
    return (
      errors.articleSpecification?.linksToAdvertiser?.maxNumber?.message ||
      (errors.articleSpecification?.linksToAdvertiser?.message &&
      linksMax === undefined
        ? "Maximum number of links is required"
        : "")
    );
  };

  useEffect(() => {
    if (shouldShowWordCount) {
      if (wordCountMin === undefined || wordCountMax === undefined) {
        if (wordCountMin === undefined) {
          setError("articleSpecification.wordCount.min", {
            type: "required",
            message: "Minimum word count is required",
          });
        }
        if (wordCountMax === undefined) {
          setError("articleSpecification.wordCount.max", {
            type: "required",
            message: "Maximum word count is required",
          });
        }
      } else {
        if (wordCountMin !== undefined) {
          clearErrors("articleSpecification.wordCount.min");
        }
        if (wordCountMax !== undefined) {
          clearErrors("articleSpecification.wordCount.max");
        }

        if (wordCountMax <= wordCountMin) {
          setError("articleSpecification.wordCount.max", {
            type: "manual",
            message: "Maximum word count must be strictly greater than minimum",
          });
        } else {
          clearErrors("articleSpecification.wordCount.max");
          clearErrors("articleSpecification.wordCount");
        }
      }
    } else {
      clearErrors([
        "articleSpecification.wordCount.min",
        "articleSpecification.wordCount.max",
        "articleSpecification.wordCount",
      ]);
    }
  }, [wordCountMin, wordCountMax, shouldShowWordCount, setError, clearErrors]);

  useEffect(() => {
    if (shouldShowLinkNumbers) {
      if (linksMin === undefined || linksMax === undefined) {
        if (linksMin === undefined) {
          setError("articleSpecification.linksToAdvertiser.minNumber", {
            type: "required",
            message: "Minimum number of links is required",
          });
        }
        if (linksMax === undefined) {
          setError("articleSpecification.linksToAdvertiser.maxNumber", {
            type: "required",
            message: "Maximum number of links is required",
          });
        }
      } else {
        if (linksMin !== undefined) {
          clearErrors("articleSpecification.linksToAdvertiser.minNumber");
        }
        if (linksMax !== undefined) {
          clearErrors("articleSpecification.linksToAdvertiser.maxNumber");
        }

        if (linksMax <= linksMin) {
          setError("articleSpecification.linksToAdvertiser.maxNumber", {
            type: "manual",
            message:
              "Maximum number of links must be strictly greater than minimum",
          });
        } else {
          clearErrors("articleSpecification.linksToAdvertiser.maxNumber");
          clearErrors("articleSpecification.linksToAdvertiser");
        }
      }
    } else {
      clearErrors([
        "articleSpecification.linksToAdvertiser.minNumber",
        "articleSpecification.linksToAdvertiser.maxNumber",
        "articleSpecification.linksToAdvertiser",
      ]);
    }
  }, [linksMin, linksMax, shouldShowLinkNumbers, setError, clearErrors]);

  const handleWordCountChange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    clearErrors("articleSpecification.wordCount");
    setValue(
      `articleSpecification.wordCount.${field}` as
        | "articleSpecification.wordCount.min"
        | "articleSpecification.wordCount.max",
      numValue
    );
    setTimeout(() => {
      trigger([
        "articleSpecification.wordCount.min",
        "articleSpecification.wordCount.max",
      ]);
    }, 0);
  };

  const handleLinkCountChange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    clearErrors("articleSpecification.linksToAdvertiser");
    setValue(
      `articleSpecification.linksToAdvertiser.${field}Number` as
        | "articleSpecification.linksToAdvertiser.minNumber"
        | "articleSpecification.linksToAdvertiser.maxNumber",
      numValue
    );
    setTimeout(() => {
      trigger([
        "articleSpecification.linksToAdvertiser.minNumber",
        "articleSpecification.linksToAdvertiser.maxNumber",
      ]);
    }, 0);
  };

  const handleContentProvisionChange = (value: string) => {
    const isClient = value === "client";
    setValue("articleSpecification.clientProvidesContent", isClient);

    if (isClient) {
      setValue("articleSpecification.wordCount.min", undefined);
      setValue("articleSpecification.wordCount.max", undefined);
      clearErrors([
        "articleSpecification.wordCount.min",
        "articleSpecification.wordCount.max",
        "articleSpecification.wordCount",
      ]);
    } else {
      setTimeout(() => {
        trigger([
          "articleSpecification.wordCount.min",
          "articleSpecification.wordCount.max",
        ]);
      }, 100);
    }
  };

  const handleLinkTaggingChange = (value: string) => {
    const isNoTagged = value === "noTagged";
    setValue("articleSpecification.linksToAdvertiser.noTagged", isNoTagged);

    if (isNoTagged) {
      setValue("articleSpecification.linksToAdvertiser.minNumber", undefined);
      setValue("articleSpecification.linksToAdvertiser.maxNumber", undefined);
      clearErrors([
        "articleSpecification.linksToAdvertiser.minNumber",
        "articleSpecification.linksToAdvertiser.maxNumber",
        "articleSpecification.linksToAdvertiser",
      ]);
    } else {
      setTimeout(() => {
        trigger([
          "articleSpecification.linksToAdvertiser.minNumber",
          "articleSpecification.linksToAdvertiser.maxNumber",
        ]);
      }, 100);
    }
  };

  return (
    <>
      <Label fontWeight={600} fontSize={24} className="mb-5 mt-20">
        Article specification
      </Label>
      <Card className="w-full mx-auto">
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <Label fontWeight={400} fontSize={14}>
                  Is writing of an article included in the offer?
                </Label>
                <RadioGroup
                  value={
                    includeArticle === true
                      ? "yes"
                      : includeArticle === false
                      ? "no"
                      : ""
                  }
                  onValueChange={(value) =>
                    setValue(
                      "articleSpecification.includeArticle",
                      value === "yes"
                    )
                  }
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="article-yes" />
                    <Label
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                      htmlFor="article-yes"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="article-no" />
                    <Label
                      textColor="muted"
                      htmlFor="article-no"
                      fontWeight={400}
                      fontSize={14}
                    >
                      No, the advertiser (client) needs to provide the content
                    </Label>
                  </div>
                </RadioGroup>
                {errors.articleSpecification?.includeArticle && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select whether article writing is included
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label fontWeight={400} fontSize={14}>
                  Number of words in the article
                </Label>
                <RadioGroup
                  value={
                    clientProvidesContent === true
                      ? "client"
                      : clientProvidesContent === false
                      ? "writer"
                      : ""
                  }
                  onValueChange={handleContentProvisionChange}
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="writer" id="content-writer" />
                    <Label
                      htmlFor="content-writer"
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                    >
                      Length of the article is not limited
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="content-client" />
                    <Label
                      htmlFor="content-client"
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                    >
                      No, the advertiser (client) needs to provide the content
                    </Label>
                  </div>
                </RadioGroup>

                {shouldShowWordCount && (
                  <div className="ml-7 space-y-2">
                    <Label fontWeight={400} fontSize={12} textColor="muted">
                      Word count range (required):
                    </Label>
                    <div className="grid grid-cols-2 gap-10 max-w-[250px]">
                      <div>
                        <Input
                          id="word-count-min"
                          type="number"
                          min="1"
                          placeholder="Min*"
                          value={wordCountMin || ""}
                          onChange={(e) =>
                            handleWordCountChange("min", e.target.value)
                          }
                          className={`border border-solid ${
                            getWordCountMinError() ? "border-red-500" : ""
                          }`}
                        />
                        {getWordCountMinError() && (
                          <p className="text-xs text-red-500 mt-1">
                            {getWordCountMinError()}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          id="word-count-max"
                          type="number"
                          min="1"
                          placeholder="Max*"
                          value={wordCountMax || ""}
                          onChange={(e) =>
                            handleWordCountChange("max", e.target.value)
                          }
                          className={`border border-solid ${
                            getWordCountMaxError() ? "border-red-500" : ""
                          }`}
                        />
                        {getWordCountMaxError() && (
                          <p className="text-xs text-red-500 mt-1">
                            {getWordCountMaxError()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {errors.articleSpecification?.clientProvidesContent && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select content provision option
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label fontWeight={400} fontSize={14}>
                  I allow DOFOLLOW links in the article
                </Label>
                <RadioGroup
                  value={
                    allowDoFollow === true
                      ? "yes"
                      : allowDoFollow === false
                      ? "no"
                      : ""
                  }
                  onValueChange={(value) =>
                    setValue(
                      "articleSpecification.allowDoFollow",
                      value === "yes"
                    )
                  }
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="dofollow-yes" />
                    <Label
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                      htmlFor="dofollow-yes"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="dofollow-no" />
                    <Label
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                      htmlFor="dofollow-no"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.articleSpecification?.allowDoFollow && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select whether you allow DOFOLLOW links
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label fontWeight={400} fontSize={14}>
                  Type of links allowed:
                </Label>
                <div className="space-y-1">
                  <RadioGroup
                    value={getCurrentLinkType()}
                    onValueChange={(value) => {
                      setValue(
                        "articleSpecification.linkTypes.brandedLinks",
                        false
                      );
                      setValue(
                        "articleSpecification.linkTypes.urlNavigational",
                        false
                      );
                      setValue(
                        "articleSpecification.linkTypes.genericLinks",
                        false
                      );
                      setValue(
                        "articleSpecification.linkTypes.exactMatchAnchors",
                        false
                      );

                      if (value === "brandedLinks") {
                        setValue(
                          "articleSpecification.linkTypes.brandedLinks",
                          true
                        );
                      } else if (value === "urlNavigational") {
                        setValue(
                          "articleSpecification.linkTypes.urlNavigational",
                          true
                        );
                      } else if (value === "genericLinks") {
                        setValue(
                          "articleSpecification.linkTypes.genericLinks",
                          true
                        );
                      } else if (value === "exactMatchAnchors") {
                        setValue(
                          "articleSpecification.linkTypes.exactMatchAnchors",
                          true
                        );
                      }
                    }}
                    className="space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="brandedLinks" id="branded-links" />
                      <Label
                        fontWeight={400}
                        fontSize={14}
                        textColor="muted"
                        htmlFor="branded-links"
                      >
                        Only brand links, URL, navigational, graphic links
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="urlNavigational"
                        id="url-navigational"
                      />
                      <Label
                        fontWeight={400}
                        fontSize={14}
                        textColor="muted"
                        htmlFor="url-navigational"
                      >
                        Only branded and generic links
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="genericLinks" id="generic-links" />
                      <Label
                        fontWeight={400}
                        fontSize={14}
                        textColor="muted"
                        htmlFor="generic-links"
                      >
                        Also mixed links (partly exact match anchors)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="exactMatchAnchors"
                        id="exact-match-anchors"
                      />
                      <Label
                        fontWeight={400}
                        fontSize={14}
                        textColor="muted"
                        htmlFor="exact-match-anchors"
                      >
                        All links, including exact match anchors
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                {errors.articleSpecification?.linkTypes && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select a link type
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <Label fontWeight={400} fontSize={14}>
                  Tagging articles policy:
                </Label>
                <RadioGroup
                  value={taggingPolicy || ""}
                  onValueChange={(value) =>
                    setValue(
                      "articleSpecification.taggingPolicy",
                      value as WebsiteFormData["articleSpecification"]["taggingPolicy"]
                    )
                  }
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-tag" id="no-tag" />
                    <Label
                      textColor="muted"
                      fontWeight={400}
                      fontSize={14}
                      htmlFor="no-tag"
                    >
                      We do not tag paid articles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="advertiser-request"
                      id="advertiser-request"
                    />
                    <Label
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                      htmlFor="advertiser-request"
                    >
                      Articles are tagged only at the advertiser&apos;s request
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="always-tag" id="always-tag" />
                    <Label
                      textColor="muted"
                      fontWeight={400}
                      fontSize={14}
                      htmlFor="always-tag"
                    >
                      We always tag articles &ldquo;Sponsored article&rdquo;
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="exact-match"
                      id="exact-match-policy"
                    />
                    <Label
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                      htmlFor="exact-match-policy"
                    >
                      All links, including exact match anchors
                    </Label>
                  </div>
                </RadioGroup>
                {errors.articleSpecification?.taggingPolicy && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select a tagging policy
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label fontWeight={400} fontSize={14}>
                  A number of links to the advertiser in the article:
                </Label>
                <RadioGroup
                  value={
                    noTaggedLinks === true
                      ? "noTagged"
                      : noTaggedLinks === false
                      ? "withNumber"
                      : ""
                  }
                  onValueChange={handleLinkTaggingChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="noTagged" id="no-tagged-links" />
                    <Label
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                      htmlFor="no-tagged-links"
                    >
                      We do not tag paid articles
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem
                        value="withNumber"
                        id="with-number-links"
                      />
                      <Label
                        fontWeight={400}
                        fontSize={14}
                        textColor="muted"
                        htmlFor="with-number-links"
                      >
                        A maximum number of links to the advertiser:
                      </Label>
                    </div>
                    {shouldShowLinkNumbers && (
                      <div className="ml-7 space-y-2">
                        <Label fontWeight={400} fontSize={12} textColor="muted">
                          Link count range (required):
                        </Label>
                        <div className="grid grid-cols-2 gap-10 max-w-[250px]">
                          <div>
                            <Input
                              id="links-min"
                              type="number"
                              min="0"
                              placeholder="Min*"
                              value={linksMin || ""}
                              onChange={(e) =>
                                handleLinkCountChange("min", e.target.value)
                              }
                              className={`border border-solid ${
                                getLinksMinError() ? "border-red-500" : ""
                              }`}
                            />
                            {getLinksMinError() && (
                              <p className="text-xs text-red-500 mt-1">
                                {getLinksMinError()}
                              </p>
                            )}
                          </div>
                          <div>
                            <Input
                              id="links-max"
                              type="number"
                              min="0"
                              placeholder="Max*"
                              value={linksMax || ""}
                              onChange={(e) =>
                                handleLinkCountChange("max", e.target.value)
                              }
                              className={`border border-solid ${
                                getLinksMaxError() ? "border-red-500" : ""
                              }`}
                            />
                            {getLinksMaxError() && (
                              <p className="text-xs text-red-500 mt-1">
                                {getLinksMaxError()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </RadioGroup>
                {errors.articleSpecification?.linksToAdvertiser?.noTagged && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select an option for advertiser links
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label fontWeight={400} fontSize={14}>
                  Other links in the article:
                </Label>
                <RadioGroup
                  value={
                    allowOtherLinks === true
                      ? "allow"
                      : allowOtherLinks === false
                      ? "not-allow"
                      : ""
                  }
                  onValueChange={(value) =>
                    setValue(
                      "articleSpecification.otherLinks.allowOtherLinks",
                      value === "allow"
                    )
                  }
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="allow" id="allow-other-links" />
                    <Label
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                      htmlFor="allow-other-links"
                    >
                      We allow links to other websites in the content of the
                      article
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="not-allow"
                      id="not-allow-other-links"
                    />
                    <Label
                      fontWeight={400}
                      fontSize={14}
                      textColor="muted"
                      htmlFor="not-allow-other-links"
                    >
                      We DO NOT allow links to other websites in the content of
                      the article
                    </Label>
                  </div>
                </RadioGroup>
                {errors.articleSpecification?.otherLinks?.allowOtherLinks && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select whether you allow other links
                  </p>
                )}
              </div>

              <div className="space-y-4 w-[70%]">
                <Label fontWeight={400} fontSize={14}>
                  Other content rules/specifications:
                </Label>
                <Textarea
                  placeholder="Enter any additional content rules or specifications"
                  rows={4}
                  value={watch("articleSpecification.otherRules") || ""}
                  onChange={(e) =>
                    setValue("articleSpecification.otherRules", e.target.value)
                  }
                  error={errors.articleSpecification?.otherRules?.message || ""}
                  className="w-full min-h-[100px] text-sm sm:text-base"
                />

                {errors.articleSpecification?.otherRules && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.articleSpecification.otherRules.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
