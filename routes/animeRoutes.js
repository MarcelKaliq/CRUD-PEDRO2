const express = require('express');
const router = express.Router();
const Anime = require('../models/Anime');

router.post('/animes', async (req, res) => {
    try {
        const novo = await Anime.create(req.body);
        res.status(201).json(novo);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar registro.' });
    }
});

router.get('/animes', async (req, res) => {
    try {
        const animes = await Anime.find();
        res.json(animes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados.' });
    }
});

router.put('/animes/:id', async (req, res) => {
    try {
        const atualizado = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!atualizado) {
            return res.status(404).json({ error: 'Registro nao encontrado.' });
        }
        res.json(atualizado);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar dados.' });
    }
});

router.delete('/animes/:id', async (req, res) => {
    try {
        const deletado = await Anime.findByIdAndDelete(req.params.id);
        if (!deletado) {
            return res.status(404).json({ error: 'Registro nao encontrado.' });
        }
        res.json({ message: 'Deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao deletar.' });
    }
});

module.exports = router;