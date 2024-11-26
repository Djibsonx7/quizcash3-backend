const express = require('express');
const { createSession, joinSession, getAllSessions } = require('../controllers/sessionController');

const router = express.Router();

router.post('/create', createSession); // Créer une session
router.post('/join', joinSession); // Rejoindre une session
router.get('/all', getAllSessions); // Récupérer toutes les sessions

module.exports = router;
