import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A thin native-select wrapper styled to match the DSS design system.
 * We use native <select> deliberately — Radix Select adds significant
 * bundle weight and the RIASEC/JAMB dropdowns have many options better
 * served by the OS native picker on mobile.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "appearance-none transition-all duration-200",
        // Arrow chevron via bg-image — avoids adding an extra wrapper element
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_14px_center] pr-10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export { Select };
