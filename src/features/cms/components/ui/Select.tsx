import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";
import { BASE_FIELD } from "@/features/cms/components/ui/Input";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options, placeholder, invalid, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(BASE_FIELD, "pr-8", invalid && "border-error", className)}
      {...props}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});
