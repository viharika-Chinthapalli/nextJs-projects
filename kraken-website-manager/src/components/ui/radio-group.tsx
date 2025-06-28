import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, onMouseDown, ...props }, ref) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    onMouseDown?.(e);
  };

  return (
    <div className="relative inline-flex items-center">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "h-4 w-4 rounded-full border bg-transparent transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
          "data-[state=checked]:border-secondary data-[state=checked]:bg-white",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center w-full h-full">
          <div
            className={cn(
              "h-2 w-2 rounded-full bg-secondary transition-all duration-200",
              isAnimating ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}
          />
        </RadioGroupPrimitive.Indicator>

        {isAnimating && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "#613FDD1C",
              animation: "radioRipple 0.4s ease-out forwards",
            }}
          />
        )}
      </RadioGroupPrimitive.Item>

      <style jsx>{`
        @keyframes radioRipple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});





RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
