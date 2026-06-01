const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose'); // Garante que o mongoose está aqui
const path = require('path');
require('dotenv').config(); // Carrega suas variáveis do arquivo .env

const app = express();

// Middlewares essenciais para o servidor funcionar
app.use(express.json());
// Faz o Express servir os arquivos da sua pasta frontend na rota raiz (/)
app.use(express.static(path.join(__dirname, 'frontend')));

// CONFIGURAÇÃO DO SWAGGER (Injetando as rotas como objeto JS puro para não quebrar)
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
    apis: [], // Deixado vazio para o formatador não quebrar os comentários!
};

// Ativa a rota da documentação
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// IMPORTAÇÃO DAS SUAS ROTAS (Deixe o arquivo routes/animeRoutes.js limpo de comentários)
const animeRoutes = require('./routes/animeRoutes');
app.use(animeRoutes);
// CONEXÃO COM O MONGOOSE (Ajuste se o seu projeto usar uma string diferente)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crud-animes')
    .then(() => console.log('MongoDB Conectado'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// PORTA E INICIALIZAÇÃO DO SERVIDOR (O que estava faltando para ir pro ar!)
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
    console.log(`Acesse a documentação em: http://localhost:${PORT}/api-docs/`);
});