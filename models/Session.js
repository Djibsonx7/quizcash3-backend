const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true }, // Référence au modèle Player
  players: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // Référence correcte au modèle Player
      username: { type: String },
      score: { type: Number, default: 0 },
    },
  ],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Référence aux questions
  isActive: { type: Boolean, default: false }, // Statut de la session
  createdAt: { type: Date, default: Date.now }, // Date de création
});

module.exports = mongoose.model('Session', SessionSchema);
