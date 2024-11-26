const express = require('express');
const { addPlayer } = require('../controllers/playerController');
const router = express.Router();

router.post('/', addPlayer);

module.exports = router;
