const mongoose = require('mongoose');
const User = require('../models/Player'); // Assure-toi que le chemin est correct

const seedUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/quizcash3', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecté à MongoDB');

    const user = new User({
      username: 'AdminUser',
      email: 'admin@example.com',
      password: 'securepassword', // Attention : ce mot de passe n'est pas encrypté (à ne pas faire en production)
    });

    const savedUser = await user.save();
    console.log('Utilisateur inséré avec succès :', savedUser);
    mongoose.disconnect();
  } catch (error) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur :', error.message);
    mongoose.disconnect();
  }
};

seedUsers();
