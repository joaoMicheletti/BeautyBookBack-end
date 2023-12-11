const connect = require('../../../database/connection');
module.exports = {
    //relatório de entrada Bruto;
    async RelatorioDeEntrada(request, response){
        const {cpf_salao} = request.body;
        var result = await connect('agenda').where('cpf_salao', cpf_salao).where('status_servico', 'finalizado').select("*");
        if(result.length === 0){return response.json("Nada encontrado")};
        var quantidade = result.length;
        var valorTotal = 0;
        for(indice = 0; indice < result.length; indice ++){
            valorTotal += result[indice].preco;
        };
        var relatorio = {
            'valorTotal': valorTotal,
            'quantidade': quantidade
        };
        return response.json(relatorio);
    },
    // relatório de antrada mes.
    async RelatorioMes(request, response){
        const {mes, cpf_salao} = request.body;
        var result = await connect('agenda').where('cpf_salao',cpf_salao).where('mes', mes).where('status_servico', 'finalizado').select('*');
        if(result.length === 0){return response.json("Nada encontrado")};
        var quantidade = result.length;
        var valorTotal = 0;
        for(indice = 0; indice < result.length; indice ++){
            valorTotal += result[indice].preco;
        };
        var relatorio = {
            'valorTotal': valorTotal,
            'quantidade': quantidade
        };
        return response.json(relatorio);
    },
}