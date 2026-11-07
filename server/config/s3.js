const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize S3 Client using the AWS SDK v3 Default Credential Provider Chain.
// On Amazon EC2, it automatically discovers and uses the IAM Instance Role credentials.
// No AWS Access Key ID or Secret Access Key is required or hardcoded.
const region = process.env.AWS_REGION || 'ap-south-1';
const bucketName = process.env.S3_BUCKET_NAME || '';

const s3Client = new S3Client({
  region: region
});

// In-memory cache for presigned URLs to avoid redundant signing calculations
const presignedUrlCache = new Map();
const CACHE_TTL_MS = 45 * 60 * 1000; // 45 minutes (Presigned URL expires in 60 minutes)

/**
 * Generates a presigned GET URL for a private S3 object.
 * Falls back gracefully to the provided fallbackUrl if S3 is not configured
 * or if running in local development without AWS credentials.
 * 
 * @param {string} s3Key - S3 Object key (e.g., 'images/dishes/bruschetta.jpg')
 * @param {string} fallbackUrl - Local or external fallback image/video URL
 * @param {number} expiresInSeconds - Expiration time for presigned URL (default 3600s = 1hr)
 * @returns {Promise<string>}
 */
async function getPresignedMediaUrl(s3Key, fallbackUrl, expiresInSeconds = 3600) {
  // If no bucket is configured or no key provided, return fallback immediately
  if (!bucketName || !s3Key) {
    return fallbackUrl || '';
  }

  // Check cache
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

    // Save to cache
    presignedUrlCache.set(s3Key, {
      url: signedUrl,
      timestamp: now
    });

    return signedUrl;
  } catch (error) {
    // If running locally without IAM role or object doesn't exist, log cleanly & use fallback
    console.warn(`[S3 Notice] Presigned URL generation for "${s3Key}" failed: ${error.message}. Using fallback.`);
    return fallbackUrl || '';
  }
}

module.exports = {
  s3Client,
  bucketName,
  region,
  getPresignedMediaUrl
};

