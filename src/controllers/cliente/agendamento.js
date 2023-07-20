const connect = require('../../database/connection'); //conexão com o banco de dados;
module.exports = {
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
        console.log("salão : "+ cpf_salao);
        console.log("Funcionário : "+ cpf_funcionario);

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
                    console.log(hora_termino)
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
                    console.log(hora_termino)
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
            console.log(termino[0].intervalo_entre_agendamentos);
            //simplificando a hora.
            var horas = Math.floor(termino[0].intervalo_entre_agendamentos / 60); // Obtém a parte inteira das horas
            var minutosRestantes = termino[0].intervalo_entre_agendamentos % 60; // Obtém os minutos restantes
            var valorFormatado = horas + "." + minutosRestantes;
            var hora_termino = parseFloat(valorFormatado, 10) + hora;
            console.log(hora_termino);
        
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
        };
        
    }
}