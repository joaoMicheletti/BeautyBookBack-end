const connect = require('../../database/connection');
module.exports = {
    // funçao para definir o tempo entre um agendamento e outro ;
    async IntervaloAgendamento(request, response){
        const {cpf_salao, intervalo_entre_agendamentos} = request.body;
        const list = await connect('salao').where('cpf_salao', cpf_salao)
        .update('intervalo_entre_agendamentos', intervalo_entre_agendamentos);
        return response.json(list);        
    },
}