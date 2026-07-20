"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Camera, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/lib/components/ui/button";

interface AppImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  folder: "menu-items" | "categories";
  className?: string;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

export function AppImageUpload({
  value,
  onChange,
  folder,
  className,
}: AppImageUploadProps) {
  const t = useTranslations("common");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      if (!ACCEPTED.includes(file.type)) {
        setError(t("imageUploadInvalidType"));
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(t("imageUploadMaxSize"));
        return;
      }

      setIsUploading(true);
      try {
        const res = await apiClient.uploadFile<{ url: string }>(
          `/uploads/${folder}`,
          file
        );
        if (res.success && res.data?.url) {
          onChange(res.data.url);
        } else {
          setError(res.message || t("imageUploadFailed"));
        }
      } catch {
        setError(t("imageUploadFailed"));
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange, t]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  if (value) {
    return (
      <div className={className}>
        <div className="relative group w-full h-32 rounded-lg border overflow-hidden">
          <img
            src={value}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleFileChange}
        />
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          w-full h-28 rounded-lg border-2 border-dashed cursor-pointer
          flex flex-col items-center justify-center gap-1 transition-colors
          ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        {isUploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        ) : (
          <>
            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground">
              {t("imageUploadDragDrop")}
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              {t("imageUploadFormats")}
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFileChange}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
