require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const configureSocket = require('./config/socket');
const redis = require('./config/redis');

const server = http.createServer(app);

// Configurer Socket.IO
const io = configureSocket(server);

// Connexion à MongoDB
connectDB();

// Vérification de Redis
console.log('Redis est prêt pour être utilisé.');

// Écouter les requêtes HTTP
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
