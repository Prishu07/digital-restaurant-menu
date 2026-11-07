const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Routes mapped under /api
router.get('/health', menuController.getHealth);
router.get('/menu', menuController.getMenu);
router.get('/categories', menuController.getCategories);

module.exports = router;

