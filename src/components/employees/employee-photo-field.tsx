/* eslint-disable @next/next/no-img-element */
"use client";

import { ChangeEvent, useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { ImagePlus, RotateCcw, X } from "lucide-react";

type EmployeePhotoFieldProps = {
  value?: string;
  onChange: (avatarDataUrl?: string) => void;
  labels: {
  avatar: string;
  uploadPhoto: string;
  cropHint: string;
  processing: string;
  cancel: string;
  save: string;
  invalidImage: string;
  imageSize: string;
  imageFailed: string;
  removePhoto: string;
  zoom: string;
};
};

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Invalid image.")));

    image.src = src;
  });
}

async function getCroppedImageDataUrl(
  imageSrc: string,
  croppedAreaPixels: Area,
  outputSize = 320,
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported.");
  }

  canvas.width = outputSize;
  canvas.height = outputSize;

  context.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    outputSize,
    outputSize,
  );

  return canvas.toDataURL("image/jpeg", 0.88);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Invalid image file."));
    });

    reader.addEventListener("error", () => {
      reject(new Error("Invalid image file."));
    });

    reader.readAsDataURL(file);
  });
}

export default function EmployeePhotoField({
  value,
  onChange,
  labels,
}: EmployeePhotoFieldProps) {
  const [imageSrc, setImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageError, setImageError] = useState("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const isCropOpen = Boolean(imageSrc);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(nextCroppedAreaPixels);
    },
    [],
  );

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError(labels.invalidImage);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError(labels.imageSize);
      return;
    }

    try {
      setImageError("");
      setIsProcessingImage(true);

      const nextImageSrc = await readFileAsDataUrl(file);

      setImageSrc(nextImageSrc);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch {
      setImageError(labels.imageFailed);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleCancelCrop = () => {
    setImageSrc("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setImageError("");
      setIsProcessingImage(true);

      const croppedImage = await getCroppedImageDataUrl(
        imageSrc,
        croppedAreaPixels,
        320,
      );

      onChange(croppedImage);
      handleCancelCrop();
    } catch {
      setImageError(labels.imageFailed);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemovePhoto = () => {
    onChange(undefined);
    setImageError("");
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--background)] p-3 md:items-center md:gap-4 md:rounded-xl md:p-4">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--employee-avatar-border)] bg-[linear-gradient(135deg,var(--employee-avatar-bg),var(--employee-avatar-bg-soft))] text-[color:var(--employee-avatar-text)] md:size-16">
          {value ? (
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus size={20} className="md:size-[22px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[color:var(--foreground)]">
            {labels.avatar}
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--foreground-muted)]">
            {labels.cropHint}
          </p>

          <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap sm:items-center">
            <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border border-[color:var(--employee-soft-action-border)] bg-[color:var(--employee-soft-action-bg)] px-4 py-2 text-xs font-semibold text-[color:var(--foreground-muted)] transition hover:bg-[color:var(--employee-action-hover-bg)] sm:w-auto">
              {isProcessingImage ? labels.processing : labels.uploadPhoto}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>

            {value ? (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] px-3 py-2 text-xs font-semibold text-[color:var(--employee-action-text)] transition hover:bg-[color:var(--employee-action-hover-bg)] sm:w-auto"
              >
                <RotateCcw size={13} />
                {labels.removePhoto}
              </button>
            ) : null}
          </div>

          {imageError ? (
            <p className="mt-2 text-xs text-red-500">{imageError}</p>
          ) : null}
        </div>
      </div>

      {isCropOpen ? (
        <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] p-3 shadow-[0_10px_24px_var(--employee-card-shadow)] md:rounded-xl md:p-4 md:shadow-[0_14px_34px_var(--employee-card-shadow)]">
          <div className="relative h-56 overflow-hidden rounded-lg bg-black sm:h-64 md:h-72">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>

          <div className="mt-3 md:mt-4">
            <label className="text-xs font-semibold text-[color:var(--foreground-muted)]">
              {labels.zoom}
            </label>

            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-2 w-full"
            />
          </div>

          <div className="mt-4 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={handleCancelCrop}
              className="inline-flex w-full items-center justify-center rounded-lg border border-[color:var(--employee-soft-action-border)] bg-[color:var(--employee-soft-action-bg)] px-4 py-2.5 text-xs font-semibold text-[color:var(--foreground-muted)] transition hover:bg-[color:var(--employee-action-hover-bg)] sm:w-auto sm:py-2"
            >
              {labels.cancel}
            </button>

            <button
              type="button"
              onClick={handleSaveCrop}
              disabled={isProcessingImage || !croppedAreaPixels}
              className="inline-flex w-full items-center justify-center rounded-lg border border-[color:var(--employee-primary-action-border)] bg-[color:var(--employee-primary-action-bg)] px-4 py-2.5 text-xs font-semibold text-[color:var(--employee-primary-action-text)] transition hover:bg-[color:var(--employee-primary-action-hover-bg)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
            >
              {labels.save}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
