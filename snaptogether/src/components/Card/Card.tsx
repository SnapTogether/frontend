import React from "react";
import Image from "next/image";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  title: string;
  description: string;
  badgeText?: string;
}

export function Card({
  imageSrc,
  title,
  description,
  badgeText,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
    data-component-id="C004"
    className={`snaptogether-card relative overflow-hidden rounded-xl shadow-lg w-[13em] h-[24em] text-white flex flex-col justify-end ${className}`}
    {...rest}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-fill mix-blend-overlay"
        />
        </div>

      {/* Badge */}
      {badgeText && (
        <span className="absolute top-3 w-7 h-7 left-3 z-20 bg-white/80 text-sm text-black text-center py-1 rounded-full font-bold">
          {badgeText}
        </span>
      )}

      {/* Content */}
      <div className="relative text-center z-20 p-4 h-fit flex flex-col justify-end bg-gradient-to-t from-slate-400/40 via-slate-400/30 to-transparent rounded-3xl">
        <h3 className="text-md text-white font-semibold mb-1">{title}</h3>
        <p className="text-sm text-white/90">{description}</p>
      </div>

    </div>
  );
}
