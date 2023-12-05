const connect = require('../../../database/connection');
module.exports = {
    //relatório de entrada Bruto;
    async RelatorioDeEntrada(request, response){
        const {cpf_salao} = request.body;
        var result = await connect('agenda').where('cpf_salao', cpf_salao).where('status_servico', 'finalizado').select("*");
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