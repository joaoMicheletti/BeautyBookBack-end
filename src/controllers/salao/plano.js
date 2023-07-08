const connect = require('../../database/connection');
module.exports = {
    //rota de assinatura "acessada após a confirmação do pagamento da assinatura plano";
    async AssinaturaPlano(request, response){
        const Data = {
            cpf_salao,
            plano,
            assinatur,
            data_inicio_plnao,
            data_vencimento_plano,
            quantidade_funcionarios,
            assinatura_status: ativa
        } = request.body;
        console.log(Data.assinatura_status);
        const list = await connect('salao').where('cpf_salao', Data.cpf_salao)
        .update('plano', Data.plano)
        .update('assinatura', Data.assinatura)
        .update('data_inicio_plano', Data.data_inicio_plano)
        .update('data_vencimento_plano', Data.data_vencimento_plano)
        .update('quantidade_funcionarios', Data.quantidade_funcionarios)
        .update('assinatura_status', Data.assinatura_status);
        return response.json(list);
    },
}