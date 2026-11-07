const express = require('express');
const multer = require('multer');
const router = express.Router();
const adminController = require('../controllers/adminController');

// In-memory file storage for safe direct-to-S3 streaming
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Admin Authentication endpoint
router.post('/verify-pin', adminController.verifyPin);

// Protected routes (require x-admin-pin header)
router.get('/status', adminController.requireAdminPin, adminController.getStatus);
router.post('/sync-s3', adminController.requireAdminPin, adminController.syncStarterToS3);
router.post('/add-dish', adminController.requireAdminPin, upload.single('image'), adminController.addDish);
router.delete('/dish/:id', adminController.requireAdminPin, adminController.deleteDish);

module.exports = router;

