const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    tipo: { type: String, required: true },
    nota: { type: Number },
    status: { type: String, default: 'Planejo Assistir' }
});

module.exports = mongoose.model('Anime', AnimeSchema);