"use client";

import { useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const [animating, setAnimating] = useState(false);

  /* Prevent body scroll when modal is open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      setAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!animating && !open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-200",
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Panel — bottom sheet on mobile, centered on desktop */}
      <div
        className={cn(
          "relative w-full rounded-t-2xl sm:rounded-xl bg-[#111] border border-[#1a1a1a] shadow-2xl shadow-black/50 transition-all duration-300",
          "max-h-[90dvh] sm:max-h-[85vh] flex flex-col",
          sizeClasses[size],
          open
            ? "translate-y-0 opacity-100 sm:scale-100 sm:translate-y-0"
            : "translate-y-8 opacity-0 sm:scale-95 sm:translate-y-4"
        )}
      >
        {/* Mobile drag handle */}
        <div className="flex sm:hidden justify-center pt-2 pb-1 absolute top-0 left-0 right-0 z-10">
          <div className="h-1 w-10 rounded-full bg-[#333]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#1a1a1a] shrink-0 min-h-[48px]">
          <h2 className="text-sm font-semibold text-[#e8e8e8] truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 sm:h-7 sm:w-7 flex items-center justify-center rounded-lg text-[#666] hover:text-[#e8e8e8] hover:bg-[#1a1a1a] transition-colors shrink-0"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content — scrollable area with better touch scrolling */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
