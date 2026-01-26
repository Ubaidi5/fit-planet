"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GalleryImage {
  url: string;
  caption: string;
  category: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function PhotoGallery({ images, className }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(images.map((img) => img.category)));

  // Filter images by category
  const filteredImages = activeCategory
    ? images.filter((img) => img.category === activeCategory)
    : images;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setSelectedIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1,
    );
  };

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl bg-gray-100 flex items-center justify-center h-64",
          className,
        )}
      >
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              !activeCategory
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Main Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Featured Image (larger) */}
        <div
          className="col-span-2 row-span-2 relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={filteredImages[0]?.url || ""}
            alt={filteredImages[0]?.caption || "Gym photo"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-sm font-medium">
              {filteredImages[0]?.caption}
            </p>
          </div>
        </div>

        {/* Other Images */}
        {filteredImages.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index + 1)}
          >
            <Image
              src={image.url}
              alt={image.caption}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

            {/* Show "+X more" on last visible image if there are more */}
            {index === 3 && filteredImages.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  +{filteredImages.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View All Button */}
      {filteredImages.length > 5 && (
        <button
          onClick={() => openLightbox(0)}
          className="w-full py-3 text-center text-emerald-600 font-medium border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          View all {filteredImages.length} photos
        </button>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={closeLightbox}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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

          {/* Next Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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

          {/* Main Image */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={filteredImages[selectedIndex]?.url || ""}
                alt={filteredImages[selectedIndex]?.caption || ""}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-white text-lg">
                {filteredImages[selectedIndex]?.caption}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {selectedIndex + 1} of {filteredImages.length}
              </p>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 pb-2">
            {filteredImages.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(index);
                }}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                  selectedIndex === index
                    ? "border-emerald-500 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={image.url}
                  alt={image.caption}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
