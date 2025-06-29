import React from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "./label";

interface PreconditionStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "accepted";
}

interface PreconditionCardProps {
  step: PreconditionStep;
  onAccept: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function PreconditionCard({
  step,
  onAccept,
  isExpanded,
  onToggle,
}: PreconditionCardProps) {
  const StatusBadge = () => (
    <Label fontWeight={500} fontSize={13}>
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-full"
        style={{
          backgroundColor:
            step.status === "accepted"
              ? "var(--color-green-primary)"
              : "var(--color-orange-primary)",
        }}
      >
        {step.status === "accepted" ? (
          <>
            <Check className="w-4 h-4 text-green-secondary" />
            Accepted
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-orange-secondary rounded-full"></div>
            Pending
          </>
        )}
      </div>
    </Label>
  );

  return (
    <div className="bg-white border rounded-lg">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <Label fontFamily="inter" fontWeight={400} fontSize={14}>
            Hey, {step.title}
          </Label>
        </div>

        <div className="flex items-center gap-2">
          {!isExpanded && <StatusBadge />}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <Label
            className="mb-4"
            fontFamily="inter"
            fontWeight={400}
            fontSize={14}
            textColor="muted"
          >
            <span style={{ lineHeight: "20px" }}>{step.description}</span>
          </Label>

          <div className="flex justify-start">
            {step.status === "pending" ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept();
                  onToggle();
                }}
                variant="purple"
                className="w-[156px]"
              >
                Accept
              </Button>
            ) : (
              <StatusBadge />
            )}
          </div>
        </div>
      )}
    </div>
  );
}