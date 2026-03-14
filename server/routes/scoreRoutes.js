const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, scoreController.saveScore);
router.get('/top', scoreController.getTopScores); 
router.get('/my', authMiddleware, scoreController.getUserScores);

module.exports = router;