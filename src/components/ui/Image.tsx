"use client";

import React from "react";
import NextImage, { ImageProps } from "next/image";

interface BaseImageProps extends ImageProps {
  addLoaderFunc?: boolean;
}

const Image: React.FC<BaseImageProps> = (props) => {
  const {
    src,
    alt,
    fill = false,
    sizes = "100%",
    width = 480,
    height = 480,
    priority = false,
    className = "",
    style = {},
    title = "",
    quality,
    placeholder,
    blurDataURL,
    addLoaderFunc = false,
  } = props;

  const fillNonFillProps = fill ? { fill } : { height, width };

  return (
    <NextImage
      src={src}
      alt={alt || title || "Sectec"}
      title={title}
      style={style}
      sizes={sizes}
      quality={quality}
      priority={priority}
      placeholder={typeof src === "object" ? "blur" : placeholder}
      blurDataURL={blurDataURL}
      className={className}
      {...fillNonFillProps}
      {...(addLoaderFunc && {
        loader: ({ src }: { src: string }) => src,
        unoptimized: true,
      })}
    />
  );
};

export default Image;
