const Session = require('../models/Session');
const Question = require('../models/Question');
const Player = require('../models/Player'); // Ajout pour vérifications futures

// Créer une session
const createSession = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "L'ID de l'utilisateur est requis." });
    }

    const questions = await Question.find().limit(10);
    if (questions.length === 0) {
      return res.status(400).json({ message: "Aucune question disponible pour cette session." });
    }

    const session = new Session({
      name: `Session ${Date.now()}`,
      creator: userId,
      players: [],
      questions: questions.map((q) => q._id),
      isActive: false,
    });

    await session.save();
    res.status(201).json({ message: "Session créée avec succès.", session });
  } catch (error) {
    console.error('Erreur lors de la création de la session :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur lors de la création de la session.' });
  }
};

// Rejoindre une session
const joinSession = async (req, res) => {
  try {
    const { sessionId, userId, username } = req.body;

    if (!sessionId || !userId || !username) {
      return res.status(400).json({ message: "SessionId, userId et username sont requis." });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session introuvable.' });
    }

    if (session.players.length >= 2) {
      return res.status(400).json({ message: 'La session est déjà complète.' });
    }

    session.players.push({ userId, username, score: 0 });

    if (session.players.length === 2) {
      session.isActive = true;
    }

    await session.save();

    const populatedSession = await Session.findById(sessionId).populate('players.userId', 'username');

    res.status(200).json({
      message: 'Joueur ajouté à la session avec succès.',
      players: populatedSession.players,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion à la session :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur lors de la connexion.' });
  }
};

// Récupérer toutes les sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('players.userId', 'username score')
      .populate('creator', 'username');

    res.status(200).json({
      message: "Liste des sessions récupérées avec succès.",
      data: sessions,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Récupérer une session par ID
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate('players.userId', 'username score')
      .populate('creator', 'username')
      .populate('questions');

    if (!session) {
      return res.status(404).json({ message: 'Session introuvable.' });
    }

    res.status(200).json({ message: 'Session récupérée avec succès.', session });
  } catch (error) {
    console.error('Erreur lors de la récupération de la session :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Terminer une session
const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session introuvable.' });
    }

    session.isActive = false;
    await session.save();

    res.status(200).json({ message: 'Session terminée avec succès.', session });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la session :', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = {
  createSession,
  joinSession,
  getAllSessions,
  getSessionById,
  completeSession,
};
