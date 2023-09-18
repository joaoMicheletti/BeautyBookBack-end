const connect = require("../../database/connection")
module.exports = {
    async buscarNaAgenda(request, response){
        const {dia, mes, ano, cpf_saloa} = request.body;
        const servicosFinalizados = await connect('agenda').where('cpf_salao', cpf_saloa).where('dia', dia)
        .where('mes', mes).where('ano', ano).select('*');
        return response.json(servicosFinalizados);
    },
}