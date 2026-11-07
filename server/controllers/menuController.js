const fs = require('fs');
const path = require('path');
const { getPresignedMediaUrl, bucketName } = require('../config/s3');

// Path to menu.json
const menuFilePath = path.join(__dirname, '../../data/menu.json');

/**
 * Helper to safely read and parse menu.json
 */
function readMenuData() {
  const rawData = fs.readFileSync(menuFilePath, 'utf-8');
  return JSON.parse(rawData);
}

/**
 * Controller: Health check
 * GET /api/health
 */
exports.getHealth = (req, res) => {
  return res.status(200).json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    s3: {
      bucketConfigured: Boolean(bucketName),
      bucketName: bucketName || 'Not configured (using fallback assets)'
    }
  });
};

/**
 * Controller: Get full restaurant menu with resolved S3 presigned URLs
 * GET /api/menu
 */
exports.getMenu = async (req, res) => {
  try {
    const data = readMenuData();
    const { category, search, dietary } = req.query;

    // Resolve presigned URLs for each menu item concurrently
    const enrichedItems = await Promise.all(
      data.items.map(async (item) => {
        const resolvedImageUrl = await getPresignedMediaUrl(item.s3Key, item.fallbackImage);
        return {
          ...item,
          imageUrl: resolvedImageUrl
        };
      })
    );

    // Filter by category if requested
    let filteredItems = enrichedItems;
    if (category && category !== 'All') {
      filteredItems = filteredItems.filter(
        item => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query if requested
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filteredItems = filteredItems.filter(
        item => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }

    // Filter by dietary if requested
    if (dietary && dietary !== 'All') {
      filteredItems = filteredItems.filter(
        item => item.dietary.toLowerCase() === dietary.toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      count: filteredItems.length,
      restaurant: data.restaurant,
      categories: data.categories,
      items: filteredItems
    });
  } catch (error) {
    console.error('[MenuController Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve restaurant menu',
      error: error.message
    });
  }
};

/**
 * Controller: Get list of food categories
 * GET /api/categories
 */
exports.getCategories = (req, res) => {
  try {
    const data = readMenuData();
    return res.status(200).json({
      success: true,
      categories: data.categories
    });
  } catch (error) {
    console.error('[CategoriesController Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message
    });
  }
};

