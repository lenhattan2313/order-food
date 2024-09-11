import { cn } from "@/lib/utils";
import { useMemo } from "react";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  type?: "box" | "page";
}

export const Spinner = ({
  size = 24,
  className,
  type = "page",
  ...props
}: ISVGProps) => {
  const icon = useMemo(
    () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    ),
    [className, props, size]
  );
  // Box-level spinner
  if (type === "box") {
    return (
      <div className="relative h-32 w-32 border border-gray-300 rounded-md flex items-center justify-center">
        {icon}
      </div>
    );
  }

  // Page-level spinner
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {icon}
    </div>
  );
};
