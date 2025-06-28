"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Play } from "lucide-react";
import { WebsiteFormData, websiteFormSchema } from "@/lib/validations";
import { ArticleSpecification } from "@/components/website/WebsiteFormSections/ArticleSpecification";
import CreateOffer from "@/components/website/WebsiteFormSections/CreateOffer";
import { WebsiteDetails } from "@/components/website/WebsiteFormSections/WebsiteDetails";
import { Layout } from "../layout/Layout";
import { PreconditionCard } from "../ui/pre-condition-card";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { useWebsiteStore } from "@/stores/websiteStore";
import linkseraImage from "../../../public/add-website-icons/linksera_image.svg";

interface PreconditionStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "accepted";
}

export default function WebsiteFormApp() {
  const router = useRouter();
  const { id } = useParams();
  const { addWebsite, updateWebsite, getWebsite, setLoading } = useWebsiteStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const initialPreconditionStep = useMemo<PreconditionStep>(
    () => ({
      id: "precondition-1",
      title: "Accept Preconditions before you start the listing!",
      description:
        "Before you can proceed with your listing, please make sure to review all required preconditions. Accepting these is mandatory to continue. It ensures your submission meets our platform standards and avoids delays. Listings that don't meet these terms may be rejected.",
      status: "pending",
    }),
    []
  );

  const [preconditionStep, setPreconditionStep] = useState<PreconditionStep>(initialPreconditionStep);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const existingWebsite = id ? getWebsite(id as string) : null;

  const defaultFormValues = useMemo<WebsiteFormData>(
    () => ({
      url: existingWebsite?.url || "",
      primaryLanguage: existingWebsite?.primaryLanguage || "",
      trafficCountry: existingWebsite?.trafficCountry || "",
      mainCategory: existingWebsite?.mainCategory || "",
      otherCategories: existingWebsite?.otherCategories || [],
      description: existingWebsite?.description || "",
      isOwner: existingWebsite?.isOwner || false,
      offerType: existingWebsite?.offerType || "normal",
      guestPosting: existingWebsite?.guestPosting || { currency: "USD" },
      linkInsertion: existingWebsite?.linkInsertion || { currency: "USD" },
      cryptoPrice: existingWebsite?.cryptoPrice || {},
      adultPrice: existingWebsite?.adultPrice || {},
      gamblingPrice: existingWebsite?.gamblingPrice || {},
      homepageLink: existingWebsite?.homepageLink || {},
      offerGuidelines: existingWebsite?.offerGuidelines || "",
      samePrice: existingWebsite?.samePrice || "no",
      samePriceValue: existingWebsite?.samePriceValue || 0,
      articleSpecification: existingWebsite?.articleSpecification || {
        includeArticle: false,
        clientProvidesContent: false,
        wordCount: { min: undefined, max: undefined },
        taggingPolicy: "no-tag",
        linksToAdvertiser: {
          noTagged: false,
          minNumber: undefined,
          maxNumber: undefined,
        },
        allowDoFollow: false,
        linkTypes: {
          brandedLinks: true,
          urlNavigational: false,
          genericLinks: false,
          exactMatchAnchors: false,
        },
        otherLinks: {
          allowOtherLinks: false,
          description: "",
        },
        otherRules: "",
      },
    }),
    [existingWebsite]
  );

  const getStorageKey = useCallback(() => {
    return id ? `websiteFormDraft_edit_${id}` : "websiteFormDraft_new";
  }, [id]);

  const form = useForm<WebsiteFormData>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    criteriaMode: "all",
  });

  useEffect(() => {
    const storageKey = getStorageKey();
    const savedData = localStorage.getItem(storageKey);
    const savedPreconditionKey = `${storageKey}_precondition`;
    const savedPreconditionStatus = localStorage.getItem(savedPreconditionKey);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset({ ...defaultFormValues, ...parsedData });
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        form.reset(defaultFormValues);
      }
    } else {
      form.reset(defaultFormValues);
    }

    if (savedPreconditionStatus === "accepted") {
      setPreconditionStep(prev => ({ ...prev, status: "accepted" }));
    }

    setIsFormInitialized(true);
  }, [form, defaultFormValues, getStorageKey]);

  useEffect(() => {
    if (!isFormInitialized) return;

    const subscription = form.watch((value) => {
      const storageKey = getStorageKey();
      try {
        const hasData = Object.values(value).some(val => {
          if (typeof val === 'string') return val.trim() !== '';
          if (typeof val === 'boolean') return val;
          if (typeof val === 'number') return val !== 0;
          if (Array.isArray(val)) return val.length > 0;
          if (typeof val === 'object' && val !== null) {
            return Object.values(val).some(nestedVal => 
              nestedVal !== null && nestedVal !== undefined && nestedVal !== '' && nestedVal !== 0
            );
          }
          return false;
        });

        if (hasData) {
          localStorage.setItem(storageKey, JSON.stringify(value));
        }
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isFormInitialized, getStorageKey]);

  useEffect(() => {
    if (!isFormInitialized) return;

    const storageKey = getStorageKey();
    const preconditionKey = `${storageKey}_precondition`;
    localStorage.setItem(preconditionKey, preconditionStep.status);
  }, [preconditionStep.status, isFormInitialized, getStorageKey]);

  const clearFormData = useCallback(() => {
    const storageKey = getStorageKey();
    const preconditionKey = `${storageKey}_precondition`;

    localStorage.removeItem(storageKey);
    localStorage.removeItem(preconditionKey);
    localStorage.removeItem("websiteFormDraft");
  }, [getStorageKey]);

  const onSubmit: SubmitHandler<WebsiteFormData> = useCallback(
    async (data) => {
      if (preconditionStep.status !== "accepted") {
        alert("Please accept the preconditions before submitting.");
        return;
      }

      setIsSubmitting(true);
      setLoading(true);

      try {
        if (id) {
          updateWebsite(id as string, data);
        } else {
          addWebsite(data);
        }

        clearFormData();
        form.reset(defaultFormValues);
        setPreconditionStep(initialPreconditionStep);

        setTimeout(() => {
          router.push("/");
        }, 100);
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
        setLoading(false);
      }
    },
    [id, addWebsite, updateWebsite, router, preconditionStep.status, setLoading, clearFormData, form, defaultFormValues, initialPreconditionStep]
  );

  const onError = useCallback((errors: FieldErrors<WebsiteFormData>) => {
    console.log("Validation errors:", errors);
    const firstErrorField = Object.keys(errors)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleAcceptPrecondition = useCallback(() => {
    setPreconditionStep((prev) => ({ ...prev, status: "accepted" }));
  }, []);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen py-4 sm:py-6 lg:py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 flex justify-between items-center">
            <Label fontWeight={600} fontSize={32} className="text-xl sm:text-2xl lg:text-3xl">
              {id ? "Edit Website" : "Add a Website"}
            </Label>
          </div>

          <div className="space-y-6">
            <Card className="mb-12 sm:mb-16 lg:mb-20">
              <div className="rounded-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center p-4 sm:p-6 lg:p-8">
                  <div className="w-full lg:w-1/2 mb-6 lg:mb-0 lg:pr-8">
                    <Label fontWeight={600} fontSize={24} lineHeight="1.5" className="mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl block">
                      Learn how to get best out of <br />linksera
                    </Label>
                    <ul className="space-y-3">
                      {[
                        "How to add your website to the marketplace",
                        "Setting pricing and niche/category filters",
                        "Uploading sample articles or guidelines",
                        "Editing or updating your website listing anytime",
                        "Tips to make your listing stand out to buyers",
                      ].map((text, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-[5px] h-[5px] rounded-full bg-muted mt-2 flex-shrink-0"></div>
                          <Label fontWeight={400} fontSize={14} fontFamily="inter" textColor="muted" className="text-sm">
                            {text}
                          </Label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full lg:w-1/2 relative">
                    <div
                      className="w-full h-48 sm:h-67 lg:h-85 rounded-lg overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
                      style={{ backgroundImage: `url(${linkseraImage.src})` }}
                    >
                      <button className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 ml-1" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <PreconditionCard
              step={preconditionStep}
              onAccept={handleAcceptPrecondition}
              isExpanded={isExpanded}
              onToggle={handleToggleExpanded}
            />

            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
              <WebsiteDetails form={form} />
              <div className="w-full lg:max-w-[70%]">
                <CreateOffer form={form} />
              </div>
              <div className="w-full lg:max-w-[70%]">
                <ArticleSpecification form={form} />
              </div>
              <div className="flex justify-center sm:justify-end pt-6">
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 flex items-center gap-2"
                  disabled={preconditionStep.status !== "accepted" || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="text-white" />
                      Submitting...
                    </>
                  ) : (
                    <>{id ? "Update Website" : "Submit Website"}</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
