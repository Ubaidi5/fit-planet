"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { uploadToR2, deleteFromR2, validateImageFile } from "@/lib/utils/r2";

interface Photo {
  id: string;
  url: string;
  caption: string;
  isCover: boolean;
  uploadedAt: Date;
}

export default function PhotoGalleryManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedPhotos: Photo[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Validate image
        const validation = validateImageFile(
          buffer,
          file.type,
          5 * 1024 * 1024,
        ); // 5MB max
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`);
          continue;
        }

        // Upload to R2
        const result = await uploadToR2(buffer, file.name, file.type);
        if (!result.success || !result.url) {
          alert(`Failed to upload ${file.name}`);
          continue;
        }
        const url = result.url;

        // Add to photos array
        uploadedPhotos.push({
          id: `photo-${Date.now()}-${i}`,
          url,
          caption: "",
          isCover: photos.length === 0 && i === 0, // First photo is cover
          uploadedAt: new Date(),
        });

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      setPhotos((prev) => [...prev, ...uploadedPhotos]);
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Failed to upload some photos. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const result = await deleteFromR2(photo.url);
      if (result.success) {
        setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      } else {
        alert("Failed to delete photo. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo. Please try again.");
    }
  };

  const handleSetCover = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) => ({
        ...photo,
        isCover: photo.id === photoId,
      })),
    );
  };

  const handleCaptionChange = (photoId: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, caption } : photo,
      ),
    );
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    setPhotos(newPhotos);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Upload Area */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Photo Gallery
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Upload high-quality photos of your gym. First photo will be used as
          cover image.
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="h-8 w-8 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Drag and drop photos here, or
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mt-2"
              >
                Browse Files
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Supported formats: JPEG, PNG, GIF, WebP (Max 5MB per file)
            </p>
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {photos.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Uploaded Photos ({photos.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Cover Badge */}
                {photo.isCover && (
                  <div className="absolute left-2 top-2 z-10 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    Cover Photo
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <Image
                    src={photo.url}
                    alt={photo.caption || `Gym photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {!photo.isCover && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetCover(photo.id)}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        Set as Cover
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(photo)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Caption Input */}
                <div className="p-3">
                  <input
                    type="text"
                    placeholder="Add caption..."
                    value={photo.caption}
                    onChange={(e) =>
                      handleCaptionChange(photo.id, e.target.value)
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Reorder Buttons */}
                <div className="flex justify-between border-t border-gray-200 p-2">
                  <button
                    type="button"
                    onClick={() => handleReorder(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span className="text-xs text-gray-500">
                    Position {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleReorder(
                        index,
                        Math.min(photos.length - 1, index + 1),
                      )
                    }
                    disabled={index === photos.length - 1}
                    className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="button" disabled={photos.length === 0}>
          Save Gallery
        </Button>
      </div>
    </div>
  );
}
