const { Server } = require('socket.io');
const Session = require('../models/Session');
const Question = require('../models/Question');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  const rooms = {};

  io.on('connection', (socket) => {
    console.log('Nouveau joueur connecté :', socket.id);

    // Rejoindre une salle
    socket.on('joinRoom', async ({ sessionId }) => {
      try {
        const session = await Session.findById(sessionId);
        if (!session) {
          return socket.emit('error', { message: 'Session introuvable.' });
        }

        // Ajouter le joueur à la salle Socket.IO
        socket.join(sessionId);
        rooms[sessionId] = rooms[sessionId] || [];
        rooms[sessionId].push(socket.id);

        // Récupérer les joueurs connectés
        const players = session.players.map((player) => ({
          username: player.username,
          userId: player.userId,
        }));

        // Envoyer les joueurs mis à jour à tous les joueurs de la session
        io.to(sessionId).emit('updatePlayers', players);

        // Démarrer la session si 2 joueurs sont connectés
        if (players.length === 2) {
          io.to(sessionId).emit('session_started');

          // Envoyer les questions au démarrage
          const questions = await Question.find().limit(10); // Exemple : récupérer 10 questions
          io.to(sessionId).emit('receiveQuestions', questions);
        }
      } catch (error) {
        console.error('Erreur lors de la connexion à la salle :', error.message);
      }
    });

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
      console.log('Joueur déconnecté :', socket.id);
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      }
    });
  });
};

module.exports = setupSocket;
