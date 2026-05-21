import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET      = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL  = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

/**
 * Upload a buffer to R2 and return the public URL.
 * All SaaS uploads are stored under the "saas/" prefix to keep them
 * separate from the Shopify app's images in the same bucket.
 */
export async function uploadToR2({
  path,
  buffer,
  contentType = "image/jpeg",
}: {
  path: string;
  buffer: Buffer;
  contentType?: string;
}): Promise<{ path: string; publicUrl: string }> {
  const key = `saas/${path}`;

  await r2.send(
    new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: contentType,
    })
  );

  return {
    path:      key,
    publicUrl: `${PUBLIC_URL}/${key}`,
  };
}
