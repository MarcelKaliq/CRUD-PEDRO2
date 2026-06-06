const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose'); 
const path = require('path');
require('dotenv').config(); 

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API CRUD',
            version: '1.0.0',
        },
        paths: {
            '/api/animes': {
                post: {
                    summary: 'Cria um novo anime',
                    tags: ['Animes'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        titulo: { type: 'string' },
                                        tipo: { type: 'string' },
                                        nota: { type: 'number' },
                                        status: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Criado com sucesso' },
                        400: { description: 'Erro de validacao' },
                        500: { description: 'Erro interno' }
                    }
                },
                get: {
                    summary: 'Lista todos os animes',
                    tags: ['Animes'],
                    responses: {
                        200: { description: 'Lista retornada com sucesso' },
                        500: { description: 'Erro interno' }
                    }
                }
            },
            '/api/animes/{id}': {
                put: {
                    summary: 'Atualiza um anime',
                    tags: ['Animes'],
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        titulo: { type: 'string' },
                                        tipo: { type: 'string' },
                                        nota: { type: 'number' },
                                        status: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Atualizado com sucesso' },
                        404: { description: 'Nao encontrado' },
                        500: { description: 'Erro interno' }
                    }
                },
                delete: {
                    summary: 'Deleta um anime',
                    tags: ['Animes'],
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                    ],
                    responses: {
                        200: { description: 'Deletado com sucesso' },
                        404: { description: 'Nao encontrado' },
                        500: { description: 'Erro interno' }
                    }
                }
            }
        }
    },
    apis: [], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const animeRoutes = require('./routes/animeRoutes');
app.use(animeRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crud-animes')
    .then(() => console.log('MongoDB Conectado'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
    console.log(`Acesse a documentação em: http://localhost:${PORT}/api-docs/`);
});