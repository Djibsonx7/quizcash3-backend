const express = require('express');
const cors = require('cors');
const sessionRoutes = require('./routes/sessionRoutes');
const playerRoutes = require('./routes/playerRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/questions', questionRoutes);

// Route non trouvée
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route introuvable.' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur.' });
});

module.exports = app;
