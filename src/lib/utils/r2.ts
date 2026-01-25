import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Cloudflare R2 is S3-compatible, so we use AWS SDK
const r2Client = new S3Client({
  region: "auto", // Cloudflare R2 uses 'auto' region
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

/**
 * Upload a file to Cloudflare R2
 * @param file - File buffer
 * @param fileName - Unique file name
 * @param contentType - MIME type of the file
 * @returns Object with success status and file URL or error message
 */
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Generate unique file path: custom-icons/{timestamp}-{fileName}
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `custom-icons/${timestamp}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // Make the object publicly readable (optional, depends on your bucket settings)
      // ACL: 'public-read', // Note: R2 doesn't support ACLs like S3
    });

    await r2Client.send(command);

    // Generate public URL
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Error uploading to R2:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete a file from Cloudflare R2
 * @param fileUrl - Full URL of the file to delete
 * @returns Object with success status
 */
export async function deleteFromR2(
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract the key from the URL
    const urlObj = new URL(fileUrl);
    const key = urlObj.pathname.substring(1); // Remove leading '/'

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting from R2:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

/**
 * Get public URL for a file
 * @param key - File key in R2
 * @returns Public URL
 */
export function getR2Url(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Validate image file
 * @param buffer - File buffer
 * @param contentType - MIME type
 * @param maxSizeInBytes - Maximum file size (default 1MB)
 * @returns Validation result
 */
export function validateImageFile(
  buffer: Buffer,
  contentType: string,
  maxSizeInBytes: number = 1024 * 1024 // 1MB default
): { valid: boolean; error?: string } {
  // Check file size
  if (buffer.length > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeInBytes / (1024 * 1024)}MB limit`,
    };
  }

  // Check content type
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/webp",
  ];
  if (!allowedTypes.includes(contentType)) {
    return {
      valid: false,
      error:
        "Invalid file type. Only images (JPEG, PNG, GIF, SVG, WebP) are allowed",
    };
  }

  return { valid: true };
}
