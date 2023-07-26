const express = require('express');
const routes = express.Router();
const RegistrarSalao = require('./controllers/salao/registro'); //importando funções de registro
const LoginSalao  = require('./controllers/salao/login'); // importando função de login;
const HorarioFuncionamento = require('./controllers/salao/horario_funcionamento'); //fonções de horário de funcionamento;
const Servicos = require('./controllers/salao/servicos'); // funçoes relacionadas a cadastro, editar, deletar > serviços;
const Funcionario = require('./controllers/salao/funcionario'); // funções de cadastro de funcionários 
const Ajustes = require('./controllers/ajustes/ajustes'); // funções dos ajustesS
const Multer = require('multer'); // instânciando o multer;
const MulterConfig = require('./controllers/ajustes/multer'); //instânciando configurações do multer
const Planos = require('./controllers/salao/plano'); // assinatura de plano;
const AgendamentoClientes = require('./controllers/cliente/agendamento'); // funões de ageendamento para crientes.
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
//rota para resgistra  um Funcionário;
routes.post('/funcionario', Funcionario.RegistrarFuncionario);
//rota para listar os funcinários de um salão;
routes.get('/funcionario', Funcionario.ListarFuncionarios);
//rota para deleter um funcionário
routes.delete('/funcionario', Funcionario.DeletarFuncionario);
//rota para definir o intervalo entre cada agendamento ;
routes.put('/intervalo', Ajustes.IntervaloAgendamento);
// rota que previne agendqmento encima da hora ;
routes.put('/cimahora', Ajustes.EmCimaDaHora);
//routa que defuino um prazo para agendametos futuros;
routes.put('/agendamentoate', Ajustes.AgendamentoAte);
//rota de edição de senha do salão
routes.put('/pass', Ajustes.SenhaSalao);
//editar cadastro salão;
routes.put('/editarsalao', Ajustes.EditarSalao);
//rota para editar senha do funcinário
routes.put('/passfuncionarios', Ajustes.SenhaFuncionario);
//rota para salvar imagem no diretorio publico/;
routes.post('/logo', Multer(MulterConfig).single("image"), Ajustes.AdicionarImagem);
//salvando o nome da imagem no banco de daados junto com o seu salão;
routes.put('/logosalao', Ajustes.LogoSalao);
//rota para assinar um plano;
routes.put('/plano', Planos.AssinaturaPlano);
//rota para listar horarios livres na agenda
routes.get('/horarioslivres', AgendamentoClientes.ConsultarEspacoLivreNaAgenda);
//rota para registrar o agendamento
routes.post('/registraragendamento', AgendamentoClientes.CriarAgendamento);
//rota para listar os horarios já preenchidos num salão individual ou num funcionário;
routes.get('/horariospreenchidos', AgendamentoClientes.HorariosPreenchidos);
//rota para validar so o agendamento futuro do cliente será permitido;
routes.post('/agendamentosfuturos', AgendamentoClientes.AgendamentosFuturos);
module.exports = routes;