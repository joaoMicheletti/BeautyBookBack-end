const connect = require('../../../database/connection');
module.exports = {
    //buscando serviços finalizados;
    async FinalizadosDiarios(request, response){
        var DATA = new Date();
        var dia = DATA.getDate();
        var mes = DATA.getMonth();
        var ano = DATA.getFullYear();
        
        const {cpf_salao} = request.body;
        var quantFinalizado = await connect('agenda').where('cpf_salao', cpf_salao)
        .where('dia', dia).where('mes',mes + 1).where('ano', ano).where('status_servico', 'finalizado').select('*');
        var finalizado = quantFinalizado.length;
        var total = 0;
        var loop = 0;
        while (loop < quantFinalizado.length){
            total += quantFinalizado[loop].preco;
            loop ++;
        };
        return response.json({finalizado, total});
    },
    // cancelados
    async Cancelados(request, response){
        var DATA = new Date();
        var dia = DATA.getDate();
        var mes = DATA.getMonth();
        var ano = DATA.getFullYear();
        
        const {cpf_salao} = request.body;
        var quantFinalizado = await connect('agenda').where('cpf_salao', cpf_salao)
        .where('dia', dia).where('mes',mes + 1).where('ano', ano).where('status_servico', 'cancelado').select('*');
        var finalizado = quantFinalizado.length;
        var total = 0;
        var loop = 0;
        while (loop < quantFinalizado.length){
            total += quantFinalizado[loop].preco;
            loop ++;
        };
        return response.json({finalizado, total});
    },
}