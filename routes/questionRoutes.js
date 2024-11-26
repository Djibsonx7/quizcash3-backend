const express = require('express');
const { addQuestion, getAllQuestions } = require('../controllers/questionController');
const router = express.Router();

router.post('/', addQuestion);
router.get('/', getAllQuestions);

module.exports = router;
