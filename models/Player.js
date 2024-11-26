const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Player', PlayerSchema);
