const connect = require('../../database/connection'); //conexão com o banco de dados;
module.exports = {
    //função para ver se  a agenda está liberada no horaio e na data;
    async ConsultarEspacoLivreNaAgenda(request, response){
    const {
        cpf_salao, 
        cpf_funcionario,
        dia, mes, ano, hora,
        servico,
        preco,
        nome_cliente,  contato_cliente, obs,
        persent50,
        status_servico
    } = request.body;
        console.log("Funcionario :"+cpf_funcionario, + "salâo :", + cpf_salao);
        //si cpf_salao for vazio, busque na agenda do funcionários, vice e verça.
        // caso os dois forem vazios retornar erro.

        if(cpf_salao === undefined){ //vamos buscar agenda do funcionario;
            console.log('não tem salao');
            var list_funcionario = await connect('funcionarios').where('cpf_funcionario', cpf_funcionario).select('*');
            console.log(list_funcionario);

        } else if(cpf_funcionario === undefined){ // vamos buscar agenda do salão 

            /**ver o dia e horário de funcionameto para decidirmos de que horás a que horás podemos marcar na agenda.ok
             * buscar na tabela salão o a coluna que define que o cliente só poderá 
             * registrar seu agendamento apos um determinado tempo da hora atual.
             * com isso podemos determinar quantos agendamentos poderâo ser feitos até o fim do expediente.
             * Com a hora de fim de trabalho menos a hora atual vai nos dar o tempo que nos resta
             * */
            var funcionamento = await connect('horarios').where('cpf_salao', cpf_salao).select('*'); // funcionamento do dia inicio fim e o dia 
            var inicio_expediente = funcionamento[0].inicio_trabalhos; // hora que inicia o expediente.
            var fim_expediente = funcionamento[0].fim_trabalhos; //hoque que o expediente acaba
            var list_salao = await connect('agenda').where('cpf_salao', cpf_salao).select('*'); //salão no qual o agendamento pertence.
            var agendamento_do_dia = await connect('agenda').where('cpf_salao', cpf_salao) //verificar se ja temos um horario agendao .
            .where('dia', dia)
            .where('mes', mes)
            .where('ano', ano).select('dia', 'mes', 'ano', 'hora', 'hora_termino');
            
            /**o font fica responssavél de mandar uma data valida, aqui trataremos a horas**
             * caso a o hora for menor que a do inicio do expediente não sera possivel agendar
             * caso sejá maior tbm não. /
             * */
            if(hora <= inicio_expediente){ // caso o salão não esteja aberto ainda.
                console.log('nao abriu');
                return response.json('Salão fora do horário de funcionamento...');
            } else if( hora > fim_expediente){// cado o salão já esteja fechado.
                console.log('está fechado');
                return response.json('Salão fora de horário de fincionamento...');
            } else if(hora > inicio_expediente && hora < fim_expediente) { // dentro do horário de funcionamento.
                var agendamento_anterior = await connect('agenda').where('cpf_salao', cpf_salao)
                .where('dia', dia)
                .where('mes', mes)
                .where('ano', ano).select('hora_termino' >= hora);
                /**
                 * verificar se finalizou o adendimento antertior.
                 */
                if(agendamento_anterior[0].hora_termino >= hora){ 
                    return response.json(`O agendamento anterior não estará finalizado até seu horario.`);
                } else {
                    /**pegar o horaio de agendamento somar mais o tempo estimado do serviço
                     * verificar se a apossibilidade de encaixe sem conflito com o proximo egendamento.
                     */
                    var tempo_termino_servico = await connect('salao').where('cpf_salao', cpf_salao).select('intervalo_entre_agendamentos');
                    var horas = Math.floor(tempo_termino_servico[0].intervalo_entre_agendamentos / 60); // Obtém a parte inteira das horas
                    var minutosRestantes = tempo_termino_servico[0].intervalo_entre_agendamentos % 60; // Obtém os minutos restantes
                    var valorFormatado = horas + "." + minutosRestantes;
                    console.log(parseFloat(valorFormatado) + hora);
                    var termino_servico_atual = parseFloat(valorFormatado) + hora; //hora convertida para float

                    var proximo_agendamento = await connect('agenda').where('cpf_salao', cpf_salao)
                    .whereBetween('hora_termino', [hora, termino_servico_atual]).select('*')
                    console.log(proximo_agendamento.length);
                    if(proximo_agendamento.length === 0){
                        return response.json('agenda livre');
                    } else {
                        return response.json('encaixe não permitido');
                    }
                    

                    
                }              
            }



        }
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
        var termino = await connect('salao').where('cpf_salao', cpf_salao).select('intervalo_entre_agendamentos');
        console.log(termino[0].intervalo_entre_agendamentos);
        //cimplificando a hora.
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
    }
}