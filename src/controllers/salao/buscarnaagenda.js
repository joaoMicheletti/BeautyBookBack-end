const connect = require("../../database/connection")
module.exports = {
    async BuscarAgendaSalao(request, response){
        const {dia, mes, ano, cpf_salao} = request.body;
        const agendados = await connect('agenda').where('cpf_salao', cpf_salao    ).where('dia', dia)
        .where('mes', mes).where('ano', ano).select('*');
        if(agendados.length === 0){
            return response.json("nenhum agendamento encontrado.");
        } else {
            return response.json(agendados);
        };
    },
    async BuscarFuncionario(request, response){
        const {dia, mes, ano, cpf_funcionario} = request.body;
        const agendados = await connect('agenda').where('cpf_funcionario', cpf_funcionario).where('dia', dia)
        .where('mes', mes).where('ano', ano).select('*');
        if(agendados.length === 0){
            return response.json("nenhum agendamento encontrado.");
        } else {
            return response.json(agendados);
        };
    },
}