"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "../../../public/header-icons/Logo.svg";
import Icon1 from "../../../public/header-icons/Icon-1.svg";
import Icon2 from "../../../public/header-icons/Icon-2.svg";
import Icon3 from "../../../public/header-icons/Icon-3.svg";
import Icon4 from "../../../public/header-icons/Icon-4.svg";
import Image from "next/image";
import { Navigation } from "./Navigation";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const iconButtons = [
    { src: Icon1, label: "Search", alt: "Search" },
    { src: Icon2, label: "Notifications", alt: "Notifications" },
    { src: Icon3, label: "User account", alt: "User account" },
    { src: Icon4, label: "Settings", alt: "Settings" }
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-auto">
          <div className="flex items-center">
            <Image
              className="dark:invert w-20 h-auto sm:w-24 md:w-32"
              src={Logo}
              alt="Kraken logo"
              width={130}
              height={35}
              priority
            />
          </div>

          <div className="hidden lg:flex items-center">
            <Navigation />
          </div>

          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {iconButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 h-8 w-8 sm:h-10 sm:w-10"
                aria-label={button.label}
              >
                <Image
                  className="dark:invert sm:w-6 sm:h-6"
                  src={button.src}
                  alt={button.alt}
                  width={20}
                  height={20}
                  priority
                />
              </Button>
            ))}
          </div>

          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 h-10 w-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Navigation isMobile={true} />
            </div>

            <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-100 md:hidden">
              {iconButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 h-10 w-10"
                  aria-label={button.label}
                >
                  <Image
                    className="dark:invert"
                    src={button.src}
                    alt={button.alt}
                    width={24}
                    height={24}
                    priority
                  />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}