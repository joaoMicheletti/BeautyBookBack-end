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
const Pagamento = require('./controllers/salao/pagementos/sdk_mp'); //função para gerar o id de preferece, buscar pagamento;
const AgendamentoClientes = require('./controllers/cliente/agendamento'); // funões de ageendamento para crientes.
const Alteracao = require('./controllers/cpanel/alteracao');
//rota de registro de salão;
routes.post('/registrarsalao', RegistrarSalao.Registrar);
//rota de listagem de salão cadastrado;
routes.get('/listarsalao', RegistrarSalao.ListarSalao);
//rota para buscar um salão 
routes.post('/buscarsalao' , RegistrarSalao.Salao);
//rota de login do salão 
routes.post('/loginsalao', LoginSalao.LoginSalao);
//verificar assinatura ;
routes.post('/assinatura', LoginSalao.statusAssinatura);
//rota para criar os horários de funcionamento;
routes.post('/horariofuncionamento', HorarioFuncionamento.HorarioFuncionamento);
//rota para editar o horário de funcinamrento;
routes.put('/horariofuncionamento', HorarioFuncionamento.EditarHorario);
//rota de listagem de horários de funcinamento;
routes.post('/listarhorariofuncionamento', HorarioFuncionamento.Listar);
//rota para deletar um horário de funcionamento;
routes.post('/deletarhorario', HorarioFuncionamento.DeletarHorario);
//rote para registrar um serviço e seu valor
routes.post('/servicos', Servicos.Registrar);
//rota para listar os serviços cadastrados;
routes.post('/servico', Servicos.Listar);
//rota para alterar valor do serviço;
routes.put('/servicos', Servicos.EditarServicos);
//rota para deletar um serviço ;
routes.post('/deletarservicos', Servicos.Delete);
//rota para resgistra  um Funcionário;
routes.post('/funcionario', Funcionario.RegistrarFuncionario);
//rota para listar os funcinários de um salão;
routes.post('/funcionarios', Funcionario.ListarFuncionarios);
//rota para deleter um funcionário
routes.post('/deletarfuncionario', Funcionario.DeletarFuncionario);
//rota para definir o intervalo entre cada agendamento ;
routes.post('/intervalo', Ajustes.IntervaloAgendamento);
// rota que previne agendqmento encima da hora ;
routes.post('/cimahora', Ajustes.EmCimaDaHora);
//routa que defuino um prazo para agendametos futuros;
routes.post('/agendamentoate', Ajustes.AgendamentoAte);
//rota de edição de senha do salão
routes.post('/pass', Ajustes.SenhaSalao);
//editar cadastro salão;
routes.post('/editarsalao', Ajustes.EditarSalao);
//rota para editar senha do funcinário
routes.post('/passfuncionarios', Ajustes.SenhaFuncionario);
//rota para salvar imagem no diretorio publico/;
routes.post('/logo', Multer(MulterConfig).single("image"), Ajustes.AdicionarImagem);
//salvando o nome da imagem no banco de daados junto com o seu salão;
routes.post('/logosalao', Ajustes.LogoSalao);
//rota para assinar um plano;
routes.put('/plano', Planos.AssinaturaPlano);
//rota para listar horarios livres na agenda
routes.post('/horarioslivres', AgendamentoClientes.ConsultarEspacoLivreNaAgenda);
//rota para registrar o agendamento
routes.post('/registraragendamento', AgendamentoClientes.CriarAgendamento);
//rota para listar os horarios já preenchidos num salão individual ou num funcionário;
routes.post('/horariospreenchidos', AgendamentoClientes.HorariosPreenchidos);
//rota para validar so o agendamento futuro do cliente será permitido;
routes.post('/agendamentosfuturos', AgendamentoClientes.AgendamentosFuturos);
//rota para cancelar um serviço
routes.put('/cancelarservico', AgendamentoClientes.UpdateStatusServicoCancelar);
//rot pa finalizar um serviço
routes.put('/finalizarservico', AgendamentoClientes.UpdateStatusServicoFinalizar);
//rota do preference id;
routes.post('/preferenceid', Pagamento.Preferenceid);
//rota para buscar um pagamento;
routes.post('/buscarpg', Pagamento.BuscarPagamento);
//rota para salval o pymentId no bando dedados caso o pagamento seja pedente;
routes.post('/pending', Pagamento.Pending);
//cpanel update senha;
routes.post('/cpanelpass', Alteracao.CpanelSenha);
//update plano;
routes.post('/cpanelplano', Alteracao.EditarPlano);
// update assinatura;
routes.post('/cpanelassinatura', Alteracao.EditarAssinatura);
//editar assinatura_status; 
routes.post('/cpanelassinatura_status', Alteracao.EditarAssinaturaStatus);
//editar data de inicio do plano;
routes.post('/cpaneldata_inicio_plano', Alteracao.DataInicio);
//editar data_vencimento_plano
routes.post('/cpaneldata_vencimento_plano', Alteracao.DataFim);
// editar limite de funcionário;
routes.post('/cpanellimite_funcionarios', Alteracao.FuncionarioLimite);
module.exports = routes;