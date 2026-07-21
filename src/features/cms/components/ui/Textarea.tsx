import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";
import { BASE_FIELD } from "@/features/cms/components/ui/Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          BASE_FIELD,
          "min-h-24 resize-y",
          invalid && "border-error focus:border-error",
          className,
        )}
        {...props}
      />
    );
  },
);
