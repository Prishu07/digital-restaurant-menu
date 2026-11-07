const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// AWS SDK v3 Default Credential Provider Chain:
// Automatically uses EC2 IAM Instance Role in AWS.
// Zero hardcoded credentials or API keys.
const region = process.env.AWS_REGION || 'ap-south-1';
const bucketName = process.env.S3_BUCKET_NAME || '';

const s3Client = new S3Client({
  region: region
});

// In-memory cache for presigned URLs (45-minute TTL)
const presignedUrlCache = new Map();
const CACHE_TTL_MS = 45 * 60 * 1000;

/**
 * Generates a presigned GET URL for a private S3 object.
 * Falls back gracefully to fallbackUrl if S3 is unconfigured or during offline local dev.
 */
async function getPresignedMediaUrl(s3Key, fallbackUrl, expiresInSeconds = 3600) {
  if (!bucketName || !s3Key) {
    return fallbackUrl || '';
  }

  const cached = presignedUrlCache.get(s3Key);
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.url;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds
    });

    presignedUrlCache.set(s3Key, {
      url: signedUrl,
      timestamp: now
    });

    return signedUrl;
  } catch (error) {
    console.warn(`[S3 Notice] Presigned URL generation for "${s3Key}" failed: ${error.message}. Using fallback.`);
    return fallbackUrl || '';
  }
}

/**
 * Uploads a Buffer directly to private S3 Bucket using IAM credentials
 */
async function uploadBufferToS3(buffer, s3Key, contentType = 'image/jpeg') {
  if (!bucketName) {
    throw new Error('S3_BUCKET_NAME is not configured in .env file');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: buffer,
    ContentType: contentType
  });

  await s3Client.send(command);
  // Clear any cached URL for this key
  presignedUrlCache.delete(s3Key);
  return `s3://${bucketName}/${s3Key}`;
}

module.exports = {
  s3Client,
  bucketName,
  region,
  getPresignedMediaUrl,
  uploadBufferToS3
};
