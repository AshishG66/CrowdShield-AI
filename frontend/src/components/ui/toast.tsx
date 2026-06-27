"use client";

import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

export function toast({ title, description, variant = "default" }: ToastProps) {
  if (variant === "destructive") {
    return sonnerToast.error(title || "Error", {
      description: description,
    });
  }
  if (variant === "success") {
    return sonnerToast.success(title || "Success", {
      description: description,
    });
  }
  return sonnerToast(title || "Notification", {
    description: description,
  });
}
