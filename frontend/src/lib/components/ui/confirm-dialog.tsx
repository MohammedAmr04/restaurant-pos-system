"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const tCommon = useTranslations("common");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                variant === "danger" ? "bg-destructive/10" : "bg-yellow-100"
              }`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${
                  variant === "danger" ? "text-destructive" : "text-yellow-600"
                }`}
              />
            </span>
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">{message}</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText ?? tCommon("cancel")}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? tCommon("loading") : (confirmText ?? tCommon("confirm"))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
