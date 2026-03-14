const Score = require('../models/Score');
const User = require('../models/User');
const { Op } = require('sequelize');


exports.saveScore = async (req, res) => {
  const { score, lines, level } = req.body;
  const userId = req.userId;

  try {
    const newScore = await Score.create({
      userId,
      score,
      lines,
      level,
    });

   
    const topScores = await Score.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['score', 'DESC']],
      limit: 10,
    });

    const io = req.app.get('io');
    io.emit('top_scores_updated', topScores);

    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getTopScores = async (req, res) => {
  try {
    const topScores = await Score.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['score', 'DESC']],
      limit: 10,
    });
    res.json(topScores);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserScores = async (req, res) => {
  const userId = req.userId;
  try {
    const scores = await Score.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};