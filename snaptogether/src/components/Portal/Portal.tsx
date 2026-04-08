"use client";

import { type ReactPortal } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

export function Portal({ children }: PortalProps): ReactPortal | null {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}
