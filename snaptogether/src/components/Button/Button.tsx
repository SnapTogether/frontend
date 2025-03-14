"use client";

import React from "react";
import clsx from "clsx";

type ButtonProps = {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
  iconLeft?: React.ReactNode; // ✅ Left icon prop
  iconRight?: React.ReactNode; // ✅ Right icon prop
  type?: "button" | "submit" | "reset";
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className,
  children,
  iconLeft,
  iconRight,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ";

  const variantStyles = {
    primary:
      "bg-[rgba(120,128,181,0.2)] font-mulish rounded-full text-white hover:opacity-[90%]  focus:ring-blue-500",
    secondary:
      "border border-blue-600 text-blue-600 focus:ring-slate-500",
    tertiary: "bg-transparent text-blue-600 hover:underline hover:bg-transparent",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-lg",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
        "transition-all duration-300"
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {/* ✅ Left Icon */}
      {iconLeft && <span className={clsx(children && "mr-2")}>{iconLeft}</span>}
      
      {children}
      
      {/* ✅ Right Icon */}
      {iconRight && <span className={clsx(children && "ml-2")}>{iconRight}</span>}
    </button>
  );
}
