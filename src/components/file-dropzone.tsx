"use client";

import { UploadIcon } from "lucide-react";
import type {
  DragEvent,
  ChangeEvent as ReactChangeEvent,
  ReactNode,
} from "react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface FileDropzoneProps {
  /** Mirrors the file input's accept attribute, e.g. ".csv,.pdf". */
  accept?: string;
  className?: string;
  disabled?: boolean;
  /** Secondary line, typically the accepted formats or a size limit. */
  hint?: ReactNode;
  icon?: ReactNode;
  /** Primary line. Swap it for a progress message while work is in flight. */
  label: ReactNode;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}

/**
 * A drop target that is also a button, so pointer, touch and keyboard all
 * reach the same file picker. It owns no upload logic: the caller receives the
 * chosen files and decides what happens next.
 */
export function FileDropzone({
  accept,
  className,
  disabled = false,
  hint,
  icon,
  label,
  multiple = false,
  onFiles,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const emit = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) {
        return;
      }
      onFiles(Array.from(list));
    },
    [onFiles]
  );

  const handlePick = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      emit(event.target.files);
      // Re-picking the same file fires no change event unless the value resets.
      event.target.value = "";
    },
    [emit]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setDragOver(false);
      if (!disabled) {
        emit(event.dataTransfer.files);
      }
    },
    [disabled, emit]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  return (
    <>
      <button
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-border border-dashed bg-card px-6 py-8 text-center transition-colors",
          "hover:border-primary/50 hover:bg-accent/30",
          "focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          dragOver && "border-primary bg-primary/5",
          className
        )}
        disabled={disabled}
        onClick={openPicker}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        type="button"
      >
        {icon ?? (
          <UploadIcon
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
        )}
        <span className="font-medium text-foreground text-sm">{label}</span>
        {hint ? (
          <span className="text-muted-foreground text-xs">{hint}</span>
        ) : null}
      </button>
      {/*
       * The button above is the control users see and operate. This input is
       * only the mechanism that opens the picker, so it stays out of the
       * accessibility tree rather than carrying a duplicate label.
       */}
      <input
        accept={accept}
        aria-hidden="true"
        className="hidden"
        multiple={multiple}
        onChange={handlePick}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />
    </>
  );
}
