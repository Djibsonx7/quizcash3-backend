const mongoose = require('mongoose');
const Question = require('../models/Question'); // Assure-toi que le chemin est correct

const seedQuestions = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/quizcash3', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecté à MongoDB');

    const questions = [
      {
        text: 'Quelle est la capitale de la France ?',
        choices: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
        correctAnswer: 'Paris',
        difficulty: 'easy',
        category: 'Géographie',
      },
      {
        text: 'Combien font 2 + 2 ?',
        choices: ['3', '4', '5', '6'],
        correctAnswer: '4',
        difficulty: 'easy',
        category: 'Mathématiques',
      },
      {
        text: 'Quelle planète est connue comme la planète rouge ?',
        choices: ['Mars', 'Jupiter', 'Saturne', 'Venus'],
        correctAnswer: 'Mars',
        difficulty: 'medium',
        category: 'Astronomie',
      },
      // Ajoute d'autres questions pour atteindre au moins 10
    ];

    await Question.insertMany(questions);
    console.log('Questions insérées avec succès');
    mongoose.disconnect();
  } catch (error) {
    console.error('Erreur lors de l\'insertion des questions :', error.message);
    mongoose.disconnect();
  }
};

seedQuestions();
