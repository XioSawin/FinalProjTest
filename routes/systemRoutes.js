const express = require('express');
const router = express.Router();

const systemController = require('../controllers/systemController');

router.get('/', systemController.getInfo);

module.exports = router;