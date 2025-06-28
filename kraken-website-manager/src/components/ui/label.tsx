import React, { memo, useMemo } from "react";

type FontFamily = "dm-sans" | "inter";
type FontWeight = 400 | 500 | 600;
type FontSize = 12 | 13 | 14 | 16 | 18 | 24 | 32;
type TextColor = "default" | "muted" | "custom";

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  fontFamily?: FontFamily;
  fontWeight?: FontWeight;
  fontSize?: FontSize;
  lineHeight?: string;
  textColor?: TextColor;
  customColor?: string;
}

export const Label = memo(
  ({
    children,
    htmlFor,
    className = "",
    fontFamily = "dm-sans",
    fontWeight = 500,
    fontSize = 14,
    lineHeight,
    textColor = "default",
    customColor,
  }: LabelProps) => {
    const computedStyles = useMemo(() => {
      const getFontFamily = (font: FontFamily) => {
        switch (font) {
          case "dm-sans":
            return "font-[DM Sans]";
          case "inter":
            return "font-[Inter]";
          default:
            return "font-[DM Sans]";
        }
      };

      const getFontWeight = (weight: FontWeight) => {
        switch (weight) {
          case 400:
            return "font-normal";
          case 500:
            return "font-medium";
          case 600:
            return "font-semibold";
          default:
            return "font-medium";
        }
      };

      const getTextColor = (color: TextColor, custom?: string) => {
        switch (color) {
          case "default":
            return "text-primary";
          case "muted":
            return "text-muted";
          case "custom":
            return custom ? `text-[${custom}]` : "text-primary";
          default:
            return "text-primary";
        }
      };

      const getDefaultLineHeight = (size: FontSize) => {
        const lineHeightMap: Record<FontSize, string> = {
          12: "16px",
          13: "18px",
          14: "20px",
          16: "24px",
          18: "24px",
          24: "32px",
          32: "40px",
        };
        return lineHeightMap[size] || "20px";
      };

      const finalLineHeight = lineHeight || getDefaultLineHeight(fontSize);

      return {
        fontFamily: getFontFamily(fontFamily),
        fontWeight: getFontWeight(fontWeight),
        textColor: getTextColor(textColor, customColor),
        lineHeight: finalLineHeight,
      };
    }, [fontFamily, fontWeight, textColor, customColor, fontSize, lineHeight]);

    return (
      <label
        htmlFor={htmlFor}
        className={`
        block
        ${computedStyles.fontFamily}
        ${computedStyles.fontWeight}
        ${computedStyles.textColor}
        tracking-[0px]
        leading-normal
        ${className}
      `}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: computedStyles.lineHeight,
        }}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";
