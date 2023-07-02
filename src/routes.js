const express = require('express');
const routes = express.Router();

const RegistrarSalao = require('./controllers/salao/registro'); //importando funções de registro

//rota de registro de salão;
routes.post('/registrarsalao', RegistrarSalao.Registrar);
//rota de listagem de salão cadastrado;
routes.get('/listarsalao', RegistrarSalao.ListarSalao);
module.exports = routes;