// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx"; // Optional: For Tailwind class merging
import { InputProps } from "./types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
        <input
          ref={ref}
          className={clsx(
            "w-full p-2 border rounded-md focus:outline-none focus:ring-2 text-black",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input"; // Fix for forwardRef component

export default Input;
