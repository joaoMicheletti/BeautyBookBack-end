const express = require('express');
const routes = express.Router();

const RegistrarSalao = require('./controllers/salao/registro'); //importando funções de registro

//rota de registro de salão;
routes.get('/registrarsalao', RegistrarSalao.Registrar);
module.exports = routes;