const express = require('express');
const routes = express.Router();

const RegistrarSalao = require('./controllers/salao/registro'); //importando funções de registro
const LoginSalao  = require('./controllers/salao/login'); // importando função de login;
const HorarioFuncionamento = require('./controllers/salao/horario_funcionamento'); //fonções de horário de funcionamento;

//rota de registro de salão;
routes.post('/registrarsalao', RegistrarSalao.Registrar);
//rota de listagem de salão cadastrado;
routes.get('/listarsalao', RegistrarSalao.ListarSalao);
//rota de login do salão 
routes.post('/loginsalao', LoginSalao.LoginSalao);
//rota para criar os horários de funcionamento;
routes.post('/horariofuncionamento', HorarioFuncionamento.HorarioFuncionamento);
//rota para editar o horário de funcinamrento;
routes.put('/horariofuncionamento', HorarioFuncionamento.EditarHorario);
//rota de listagem de horários de funcinamento;
routes.get('/horariofuncionamento', HorarioFuncionamento.Listar);
module.exports = routes;