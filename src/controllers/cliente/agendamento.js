const connect = require('../../database/connection'); //conexão com o banco de dados;
module.exports = {
    //agendamentos futuros;
    async AgendamentosFuturos(request, response){
        const {cpf_salao, cpf_funcionario, data_atual, dia, mes, ano} = request.body;
        //não veio o dado cpf_saloa;
        if(cpf_salao === undefined){
            const Lista = await connect('funcionarios').where('cpf_funcionario', cpf_funcionario).select('cpf_salao');
            const SalaoFuncionario = await connect('salao').where('cpf_salao', Lista[0].cpf_salao);
            //quantidade em dias a ser somada mais a data atual,
            //para determinar se esta dentro do prazo permitido para agendamentos futuros;
            var AgeendamentoAte = SalaoFuncionario[0].permitir_agendamento_ate;
            //data Atual;
            // Quebrar a string da data em dia, mês e ano
            var partes = data_atual.split('/');
            var Dia = parseInt(partes[0], 10);
            var Mes = parseInt(partes[1], 10) - 1 ; // Os meses em JavaScript são baseados em zero
            var Ano = parseInt(partes[2], 10);
            // Criar um objeto de data com os valores obtidos
            var data = new Date(Ano, Mes, Dia);
            // Adicionar o prazo "AgendamentoAte" ao objeto de data
            data.setDate(data.getDate() + AgeendamentoAte);
            var dataString = ano+'/'+mes+'/'+dia;
            var DataFormatadaParaServico = new Date(dataString); //data desejáda para o agendamento;
            if(DataFormatadaParaServico <= data){
                return response.json('Dentro do limite para Agendamentos futuros');
            } else {
                return response.json('você excedeu o limiti de prazo para agendamentos futuros')
            };
            //nçao veio o dado cpf_funcionário;
        } else if(cpf_funcionario === undefined){
            const Lista = await connect('salao').where('cpf_salao', cpf_salao).select('permitir_agendamento_ate');
            //quantidade em dias a ser somada mais a data atual,
            //para determinar se esta dentro do prazo permitido para agendamentos futuros;
            var AgeendamentoAte = Lista[0].permitir_agendamento_ate;
            
            //data Atual;
            // Quebrar a string da data em dia, mês e ano
            var partes = data_atual.split('/');
            var Dia = parseInt(partes[0], 10);
            var Mes = parseInt(partes[1], 10) - 1 ; // Os meses em JavaScript são baseados em zero
            var Ano = parseInt(partes[2], 10);
            // Criar um objeto de data com os valores obtidos
            var data = new Date(Ano, Mes, Dia);
            // Adicionar o prazo "AgendamentoAte" ao objeto de data
            data.setDate(data.getDate() + AgeendamentoAte);
            var dataString = ano+'/'+mes+'/'+dia;
            var DataFormatadaParaServico = new Date(dataString); //data desejáda para o agendamento;
            if(DataFormatadaParaServico <= data){
                return response.json('Dentro do limite para Agendamentos futuros');
            } else {
                return response.json('você excedeu o limiti de prazo para agendamentos futuros.')
            };
        };
    },
    //função para ver se  a agenda está liberada no horaio e na data;
    async ConsultarEspacoLivreNaAgenda(request, response){
        const {
            cpf_salao, 
            cpf_funcionario,
            dia_semana,
            dia, mes, ano, hora,
            servico,
            preco,
            nome_cliente,  contato_cliente, obs,
            persent50,
            status_servico
        } = request.body;
        
        //cpf_funcionario não veio no corpo da request.
        if(cpf_funcionario === undefined){
            //buscar no banco de dados o horario de funcionamento do dia.
            const funcionamento = await connect('horarios').where('cpf_salao', cpf_salao).where('dia', dia_semana).select('*');
            if(hora < funcionamento[0].inicio_trabalhos){ //salão não está aberto ainda!.
                return response.json("Fora do Horário de funcionamento.");
            } else if(hora > funcionamento[0].fim_trabalhos){ // salão já está fechado nessa hora; 
                return response.json("Fora do Horário de funcionamento.");
            } else if(hora >= funcionamento[0].inicio_trabalhos && hora <= funcionamento[0].fim_trabalhos){// dentro do horário de funcionamento;
                var agendamentos_anteriores = await connect('agenda').where('cpf_salao', cpf_salao)
                .where('dia', dia).where('mes', mes).where('ano', ano).where('hora', '<=', hora).where('hora_termino', '>' ,hora);
                if(agendamentos_anteriores.length === 0){ //não possui conflito com agendamento anterior
                    //evitar conflito com agendamentos já marcados mais a frente.
                    var termino_agendamento_atual = await connect('salao').where('cpf_salao', cpf_salao).select('intervalo_entre_agendamentos');
                    //simplificando a hora.
                    var horas = Math.floor(termino_agendamento_atual[0].intervalo_entre_agendamentos / 60); // Obtém a parte inteira das horas
                    var minutosRestantes = termino_agendamento_atual[0].intervalo_entre_agendamentos % 60; // Obtém os minutos restantes
                    var valorFormatado = horas + "." + minutosRestantes;
                    var hora_termino = parseFloat(valorFormatado, 10) + hora;
                    var proximo_agendamento = await connect('agenda').where('cpf_salao', cpf_salao)
                    .where('hora', '>', hora).where('hora', '<', hora_termino);
                    if(proximo_agendamento.length === 0){ //nao tem conflito com o proximo agendado
                        return response.json('agendamento permitido');
                    };
                    return response.json('conflito entre agendamentos');                
                };
                return response.json('Horário já ocupado');
            };
        } else if(cpf_salao === undefined){
            //buscar no banco de dados o horario de funcionamento do dia.
            var info_funcionario = await connect('funcionarios').where('cpf_funcionario', cpf_funcionario).select('*'); 
            const funcionamento = await connect('horarios').where('cpf_salao', info_funcionario[0].cpf_salao).where('dia', dia_semana).select('*');
            if(hora < funcionamento[0].inicio_trabalhos){ //salão não está aberto ainda!.
                return response.json("Fora do Horário de funcionamento.");
            } else if(hora > funcionamento[0].fim_trabalhos){ // salão já está fechado nessa hora; 
                return response.json("Fora do Horário de funcionamento.");
            } else if(hora >= funcionamento[0].inicio_trabalhos && hora <= funcionamento[0].fim_trabalhos){// dentro do horário de funcionamento;
                var agendamentos_anteriores = await connect('agenda').where('cpf_funcionario', cpf_funcionario)
                .where('dia', dia).where('mes', mes).where('ano', ano).where('hora', '<=', hora).where('hora_termino', '>' ,hora);
                if(agendamentos_anteriores.length === 0){ //não possui conflito com agendamento anterior
                    //evitar conflito com agendamentos já marcados mais a frente.
                    var termino_agendamento_atual = await connect('salao').where('cpf_salao', info_funcionario[0].cpf_salao).select('intervalo_entre_agendamentos');
                    //simplificando a hora.
                    var horas = Math.floor(termino_agendamento_atual[0].intervalo_entre_agendamentos / 60); // Obtém a parte inteira das horas
                    var minutosRestantes = termino_agendamento_atual[0].intervalo_entre_agendamentos % 60; // Obtém os minutos restantes
                    var valorFormatado = horas + "." + minutosRestantes;
                    var hora_termino = parseFloat(valorFormatado, 10) + hora;
                    console.log(hora_termino, 'this<><><><><><><><>')
                    var proximo_agendamento = await connect('agenda').where('cpf_funcionario', cpf_funcionario)
                    .where('hora', '>', hora).where('hora', '<', hora_termino);
                    if(proximo_agendamento.length === 0){ //nao tem conflito com o proximo agendado
                        return response.json('agendamento permitido');
                    };
                    return response.json('conflito entre agendamentos');                
                };
                return response.json('Horário já ocupado');
            };
        };
    },
    //função para criar o agendamento;
    async CriarAgendamento(request, response){
        //conferir se o horário não foi preenchido antes de ralmente agendar;
        const  {
            cpf_salao,
            cpf_funcionario,
            dia,
            mes,
            ano,
            hora,
            servico,
            preco,
            nome_cliente,
            contato_cliente,
            obs,
            percent50,
            status_servico
        } = request.body;
        //agendar para salão ...
        if(cpf_funcionario === undefined){
            var termino = await connect('salao').where('cpf_salao', cpf_salao).select('intervalo_entre_agendamentos');
            
            //simplificando a hora.
            var horas = Math.floor(termino[0].intervalo_entre_agendamentos / 60); // Obtém a parte inteira das horas
            var minutosRestantes = termino[0].intervalo_entre_agendamentos % 60; // Obtém os minutos restantes
            var valorFormatado = horas + "." + minutosRestantes;
            var hora_termino = parseFloat(valorFormatado, 10) + hora;
            
            const Data =  {
                cpf_salao,
                cpf_funcionario,
                dia,
                mes,
                ano,
                hora,
                hora_termino,
                servico,
                preco,
                nome_cliente,
                contato_cliente,
                obs,
                status_servico
            };
            var conf = await connect('agenda').insert(Data);
            return response.json(conf);
        }else if(cpf_salao === undefined){ //agendar para funcionário ...
            var info_funcionario = await connect('funcionarios').where('cpf_funcionario', cpf_funcionario).select('*');
            
            var termino = await connect('salao').where('cpf_salao', info_funcionario[0].cpf_salao).select('intervalo_entre_agendamentos');
            //simplificando a hora.
            var horas = Math.floor(termino[0].intervalo_entre_agendamentos / 60); // Obtém a parte inteira das horas
            var minutosRestantes = termino[0].intervalo_entre_agendamentos % 60; // Obtém os minutos restantes
            var valorFormatado = horas + "." + minutosRestantes;
            var hora_termino = parseFloat(valorFormatado, 10) + hora;
            const Data =  {
                cpf_salao: info_funcionario[0].cpf_salao,
                cpf_funcionario,
                nome_completo: info_funcionario[0].nome_completo,
                dia,
                mes,
                ano,
                hora,
                hora_termino,
                servico,
                preco,
                nome_cliente,
                contato_cliente,
                obs,
                status_servico
            };
            var conf = await connect('agenda').insert(Data);
            return response.json(conf);
        };
    },
    //listar os horarios já preenchidos.
    async HorariosPreenchidos(request, response){
        const {cpf_salao, cpf_funcionario, dia, mes, ano} = request.body;
        //não veio o dado cpf_salao;
        if(cpf_funcionario === undefined){
            const Lista = await connect('agenda').where('cpf_salao', cpf_salao)
            .where('dia', dia).where('mes', mes).where('ano', ano).where('status_servico', 'agendado');
            return response.json(Lista);
        } else if(cpf_salao === undefined){ //trabalhando com o cpf_funcionario;
            const Lista = await connect('agenda').where('cpf_funcionario', cpf_funcionario)
            .where('dia', dia).where('mes', mes).where('ano', ano).where('status_servico', 'agendado')
            .select('*');
            return response.json(Lista);
            //não veio o dado Cpf_funcionario   
        };
    },
    
    //função para listar serviços finalizados;
    async servicosFinalizados(request, response){
        console.log('serviços finalizados');
    },
    //função para atualizar o status do cerviço para cancelar;
    async UpdateStatusServicoCancelar(request, response){
        const {id} = request.body;
        const lista = await connect('agenda').where('id', id).update('status_servico', 'cancelado');
        if(lista > 0){
            return response.json('Serviço Cancelado');
        }else {
            return response.json('Erro ao Cancelar Servoço');
        };
    },
    //função para atualizar o status do serviço para finalizado;
    async UpdateStatusServicoFinalizar(request, response){
        const {id} = request.body;
        const lista = await connect('agenda').where('id', id).update('status_servico', 'finalizado');
        if(lista > 0){
            return response.json('Serviço Finalizado');
        } else {
            return response.json('Erro ao Finalizar o Serviço');
        };
    },
};