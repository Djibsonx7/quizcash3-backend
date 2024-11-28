const { Server } = require('socket.io');
const Session = require('../models/Session');
const Question = require('../models/Question');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Nouvelle connexion :', socket.id);

    // Rejoindre une salle
    socket.on('joinRoom', async ({ sessionId, userId, username }) => {
      try {
        const session = await Session.findById(sessionId);
        if (!session) {
          return socket.emit('error', { message: 'Session introuvable.' });
        }

        // Vérifier si le joueur est déjà présent
        const existingPlayer = session.players.find((player) => player.userId.toString() === userId);
        if (!existingPlayer) {
          session.players.push({ userId, username, score: 0 });
          await session.save();
        }

        // Ajouter le joueur à la salle Socket.IO
        socket.join(sessionId);

        // Envoyer la mise à jour des joueurs
        const players = session.players.map((player) => ({
          username: player.username,
          userId: player.userId,
        }));
        io.to(sessionId).emit('updatePlayers', players);
      } catch (error) {
        console.error('Erreur lors de la connexion à la salle :', error.message);
      }
    });

    // Démarrage de la session
    socket.on('startSession', async ({ sessionId }) => {
      try {
        const session = await Session.findById(sessionId);
        if (!session) {
          return socket.emit('error', { message: 'Session introuvable.' });
        }

        // Envoyer les questions et démarrer la session
        const questions = await Question.find().limit(10);
        io.to(sessionId).emit('receiveQuestions', questions);
        io.to(sessionId).emit('session_started');
        console.log(`Session ${sessionId} démarrée`);
      } catch (error) {
        console.error('Erreur lors du démarrage de la session :', error.message);
      }
    });

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
      console.log('Joueur déconnecté :', socket.id);
    });
  });
};

module.exports = setupSocket;
