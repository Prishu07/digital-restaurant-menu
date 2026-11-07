/**
 * S3 Media Upload Utility
 * 
 * Safely uploads food images and promotional videos to your private Amazon S3 bucket.
 * Uses AWS SDK v3 Default Credential Provider Chain (IAM Role or AWS CLI profile).
 * 
 * Usage:
 *   1. Upload a single custom file:
 *      node scripts/upload-media.js --file ./my-dish.jpg --key images/dishes/my-dish.jpg
 * 
 *   2. Automatically populate bucket with starter menu media assets:
 *      npm run upload:media
 *      (or: node scripts/upload-media.js --seed)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const region = process.env.AWS_REGION || 'ap-south-1';
const bucketName = process.env.S3_BUCKET_NAME;

if (!bucketName || bucketName === 'your-restaurant-menu-bucket-unique-id') {
  console.error('\x1b[31m[ERROR] S3_BUCKET_NAME is not properly configured in .env file.\x1b[0m');
  console.error('Please edit .env and set S3_BUCKET_NAME to your private S3 bucket name.\n');
  process.exit(1);
}

const s3Client = new S3Client({ region });

// Allowed MIME types for restaurant media
const ALLOWED_MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4'
};

/**
 * Upload buffer to Amazon S3
 */
async function uploadToS3(buffer, s3Key, contentType) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: buffer,
    ContentType: contentType,
    // Bucket has Block Public Access enabled; objects stay strictly private
  });

  await s3Client.send(command);
  console.log(`\x1b[32m✔ Successfully uploaded to s3://${bucketName}/${s3Key} (${contentType})\x1b[0m`);
}

/**
 * Download a remote URL into a Buffer
 */
function downloadFileBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFileBuffer(response.headers.location).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download from ${url}: Status code ${response.statusCode}`));
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Seed all starter media from menu.json directly into S3
 */
async function seedStarterMedia() {
  console.log(`\n======================================================`);
  console.log(`  Seeding Starter Media to S3 Bucket: ${bucketName}`);
  console.log(`  Region: ${region}`);
  console.log(`======================================================\n`);

  const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/menu.json'), 'utf-8'));

  // Collect all media tasks
  const tasks = [];

  // Hero & Intro media
  if (menuData.media.heroBanner) {
    tasks.push({
      key: menuData.media.heroBanner.s3Key,
      url: menuData.media.heroBanner.fallbackUrl,
      type: 'image/jpeg'
    });
  }
  if (menuData.media.introImage) {
    tasks.push({
      key: menuData.media.introImage.s3Key,
      url: menuData.media.introImage.fallbackUrl,
      type: 'image/jpeg'
    });
  }

  // Food dish items
  for (const item of menuData.items) {
    if (item.s3Key && item.fallbackImage) {
      tasks.push({
        key: item.s3Key,
        url: item.fallbackImage,
        type: 'image/jpeg'
      });
    }
  }

  console.log(`Found ${tasks.length} media assets to upload into S3...`);

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    process.stdout.write(`[${i + 1}/${tasks.length}] Downloading and uploading ${task.key} ... `);
    try {
      const buffer = await downloadFileBuffer(task.url);
      await uploadToS3(buffer, task.key, task.type);
    } catch (err) {
      console.log(`\x1b[33mWarning: Could not upload ${task.key}: ${err.message}\x1b[0m`);
    }
  }

  console.log(`\nAll media assets successfully processed for S3!`);
}

/**
 * Upload a single local file
 */
async function uploadLocalFile(filePath, s3Key) {
  if (!fs.existsSync(filePath)) {
    console.error(`\x1b[31m[ERROR] Local file not found: ${filePath}\x1b[0m`);
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = ALLOWED_MIME_TYPES[ext];

  if (!contentType) {
    console.error(`\x1b[31m[ERROR] Invalid file type: ${ext}. Allowed extensions: ${Object.keys(ALLOWED_MIME_TYPES).join(', ')}\x1b[0m`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);
  console.log(`Uploading ${filePath} (${(fileBuffer.length / 1024).toFixed(1)} KB) to s3://${bucketName}/${s3Key} ...`);
  await uploadToS3(fileBuffer, s3Key, contentType);
}

// CLI Argument parsing
const args = process.argv.slice(2);
const fileArgIndex = args.indexOf('--file');
const keyArgIndex = args.indexOf('--key');

if (fileArgIndex !== -1 && keyArgIndex !== -1) {
  const filePath = args[fileArgIndex + 1];
  const s3Key = args[keyArgIndex + 1];
  uploadLocalFile(filePath, s3Key).catch(err => {
    console.error('\x1b[31mUpload Failed:\x1b[0m', err.message);
    process.exit(1);
  });
} else {
  // Default to seeding starter media
  seedStarterMedia().catch(err => {
    console.error('\x1b[31mSeeding Failed:\x1b[0m', err.message);
    process.exit(1);
  });
}

