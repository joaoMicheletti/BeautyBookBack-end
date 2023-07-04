const express = require('express');
const routes = express.Router();

const RegistrarSalao = require('./controllers/salao/registro'); //importando funções de registro
const LoginSalao  = require('./controllers/salao/login'); // importando função de login;
const HorarioFuncionamento = require('./controllers/salao/horario_funcionamento'); //fonções de horário de funcionamento;
const Servicos = require('./controllers/salao/servicos'); // funçoes relacionadas a cadastro, editar, deletar > serviços;

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
//rote para registrar um serviço e seu valor
routes.post('/servicos', Servicos.Registrar);
//rota para listar os serviços cadastrados;
routes.get('/servicos', Servicos.Listar);
//rota para alterar valor do serviço;
routes.put('/servicos', Servicos.EditarServicos);
//rota para deletar um serviço ;
routes.delete('/servicos', Servicos.Delete);
module.exports = routes;