const fs = require('fs');
const path = require('path');
const { getPresignedMediaUrl } = require('../config/s3');

const menuFilePath = path.join(__dirname, '../../data/menu.json');

/**
 * Controller: Get restaurant promotional media with S3 presigned URLs
 * GET /api/media
 */
exports.getMedia = async (req, res) => {
  try {
    const rawData = fs.readFileSync(menuFilePath, 'utf-8');
    const { media } = JSON.parse(rawData);

    // Resolve presigned URLs for media assets
    const [heroUrl, introUrl, videoUrl, posterUrl] = await Promise.all([
      getPresignedMediaUrl(media.heroBanner.s3Key, media.heroBanner.fallbackUrl),
      getPresignedMediaUrl(media.introImage.s3Key, media.introImage.fallbackUrl),
      getPresignedMediaUrl(media.promoVideo.s3Key, media.promoVideo.fallbackUrl),
      getPresignedMediaUrl(null, media.promoVideo.posterUrl)
    ]);

    return res.status(200).json({
      success: true,
      media: {
        heroBanner: {
          url: heroUrl,
          alt: media.heroBanner.alt
        },
        introImage: {
          url: introUrl,
          alt: media.introImage.alt
        },
        promoVideo: {
          url: videoUrl,
          poster: posterUrl,
          title: media.promoVideo.title,
          subtitle: media.promoVideo.subtitle
        }
      }
    });
  } catch (error) {
    console.error('[MediaController Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve media information',
      error: error.message
    });
  }
};

