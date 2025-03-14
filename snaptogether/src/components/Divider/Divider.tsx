import React from "react";

// Define available props
export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  size?: "small" | "medium" | "large";
  border?: boolean;
  borderColor?: string; // Allows custom border colors
  width?: "full" | "half" | "quarter";
}

// Define Tailwind classes for widths
const widthClass: Record<NonNullable<DividerProps["width"]>, string> = {
  full: "w-full",
  half: "w-1/2",
  quarter: "w-1/4",
};

// Define Tailwind classes for sizes
const sizeClass: Record<NonNullable<DividerProps["size"]>, string> = {
  small: "border-t-[1px]",
  medium: "border-t-[1px]",
  large: "!border-slate-300/20 border-t-[1px]",
};

export function Divider({
  size = "large",
  border = false,
  borderColor = "border-gray-400", // Default border color
  width = "half",
  className = "",
  ...rest
}: DividerProps) {
  const resolvedBorderClass = border ? `${sizeClass[size]} ${borderColor}` : "border-0";
  const resolvedWidthClass = widthClass[width] || widthClass.half;

  return (
    <hr
      data-component-id="C003"
      aria-hidden="true"
      className={`smzh-divider ${resolvedBorderClass} ${resolvedWidthClass} ${className}`.trim()}
      {...rest}
    />
  );
}
