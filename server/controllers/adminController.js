const fs = require('fs');
const path = require('path');
const https = require('https');
const { uploadBufferToS3, bucketName, region } = require('../config/s3');

const menuFilePath = path.join(__dirname, '../../data/menu.json');

function getExpectedPin() {
  return process.env.ADMIN_PIN || '1234';
}

function readMenuData() {
  const raw = fs.readFileSync(menuFilePath, 'utf-8');
  return JSON.parse(raw);
}

function writeMenuData(data) {
  fs.writeFileSync(menuFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Middleware: Verify Admin PIN
 */
exports.requireAdminPin = (req, res, next) => {
  const pin = req.headers['x-admin-pin'] || req.body?.pin || req.query?.pin;
  if (!pin || pin.toString() !== getExpectedPin()) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Admin PIN. Access denied.'
    });
  }
  next();
};

/**
 * Controller: Verify Admin PIN
 * POST /api/admin/verify-pin
 */
exports.verifyPin = (req, res) => {
  const { pin } = req.body;
  if (pin && pin.toString() === getExpectedPin()) {
    return res.status(200).json({
      success: true,
      message: 'PIN verified successfully'
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Incorrect Admin PIN. Default is 1234.'
  });
};

/**
 * Controller: Admin System & S3 Status
 * GET /api/admin/status
 */
exports.getStatus = (req, res) => {
  try {
    const data = readMenuData();
    return res.status(200).json({
      success: true,
      s3: {
        configured: Boolean(bucketName),
        bucketName: bucketName || 'Not configured',
        region: region
      },
      menu: {
        totalDishes: data.items.length,
        categories: data.categories
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Download helper for syncing remote images to S3
 */
function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Controller: One-click Seed/Sync all Starter Menu Media into S3
 * POST /api/admin/sync-s3
 */
exports.syncStarterToS3 = async (req, res) => {
  if (!bucketName) {
    return res.status(400).json({
      success: false,
      message: 'S3_BUCKET_NAME is not set in .env. Please configure bucket name first.'
    });
  }

  try {
    const data = readMenuData();
    const results = [];

    // Collect all tasks
    const queue = [];
    if (data.media?.heroBanner) {
      queue.push({ key: data.media.heroBanner.s3Key, url: data.media.heroBanner.fallbackUrl, type: 'image/jpeg' });
    }
    if (data.media?.introImage) {
      queue.push({ key: data.media.introImage.s3Key, url: data.media.introImage.fallbackUrl, type: 'image/jpeg' });
    }
    for (const item of data.items) {
      if (item.s3Key && item.fallbackImage) {
        queue.push({ key: item.s3Key, url: item.fallbackImage, type: 'image/jpeg' });
      }
    }

    for (const task of queue) {
      try {
        const buffer = await downloadBuffer(task.url);
        await uploadBufferToS3(buffer, task.key, task.type);
        results.push({ key: task.key, status: 'success' });
      } catch (err) {
        results.push({ key: task.key, status: 'error', error: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Sync completed: ${results.filter(r => r.status === 'success').length} of ${queue.length} uploaded to s3://${bucketName}`,
      bucket: bucketName,
      results
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'S3 Sync failed: ' + err.message
    });
  }
};

/**
 * Controller: Add New Dish to Menu and Upload Image to S3
 * POST /api/admin/add-dish
 */
exports.addDish = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      dietary,
      spicyLevel,
      prepTime,
      isChefSpecial,
      isPopular
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, Category, and Price are required.'
      });
    }

    const data = readMenuData();
    const id = `item-${Date.now().toString().slice(-6)}`;
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const s3Key = `images/dishes/${cleanName}-${Date.now().toString().slice(-4)}.jpg`;

    let imageUrl = '';
    let fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

    // If an image file was uploaded
    if (req.file) {
      if (bucketName) {
        try {
          await uploadBufferToS3(req.file.buffer, s3Key, req.file.mimetype);
          console.log(`[Admin] Uploaded new dish image to S3: ${s3Key}`);
        } catch (s3Err) {
          console.warn('[Admin] S3 upload error:', s3Err.message);
        }
      }
      // Convert buffer to data URI for immediate local fallback view if S3 is unconfigured
      const base64 = req.file.buffer.toString('base64');
      fallbackImage = `data:${req.file.mimetype};base64,${base64}`;
    }

    const newItem = {
      id,
      name: name.trim(),
      category: category.trim(),
      description: description ? description.trim() : 'Freshly prepared specialty dish.',
      price: parseFloat(price),
      s3Key,
      fallbackImage,
      dietary: dietary || 'Vegetarian',
      spicyLevel: parseInt(spicyLevel) || 0,
      isPopular: Boolean(isPopular === 'true' || isPopular === true),
      isChefSpecial: Boolean(isChefSpecial === 'true' || isChefSpecial === true),
      rating: 5.0,
      prepTime: prepTime || '15 min'
    };

    // If category is new, add it to categories list
    if (!data.categories.includes(newItem.category)) {
      data.categories.push(newItem.category);
    }

    data.items.unshift(newItem); // Add to beginning of items
    writeMenuData(data);

    return res.status(201).json({
      success: true,
      message: 'New dish added successfully!',
      item: newItem
    });
  } catch (err) {
    console.error('[AddDish Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to add dish: ' + err.message
    });
  }
};

/**
 * Controller: Delete a dish from menu.json
 * DELETE /api/admin/dish/:id
 */
exports.deleteDish = (req, res) => {
  try {
    const { id } = req.params;
    const data = readMenuData();
    const initialLen = data.items.length;
    data.items = data.items.filter(item => item.id !== id);

    if (data.items.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    writeMenuData(data);
    return res.status(200).json({
      success: true,
      message: 'Dish removed successfully!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
