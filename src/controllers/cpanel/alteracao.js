const connect = require('../../database/connection');
module.exports = {
    // editar senha
    async CpanelSenha(request, response){
        const {senha, cpf} = request.body;
        await connect('salao').where('cpf_salao', cpf).select('*').update('senha', senha);
        return response.json('sucesso');
    },
    //editar plano;
    async EditarPlano(request, response){
        const {plano, cpf} = request.body;
        var result = await connect('salao').where('cpf_salao', cpf).select('*').update('plano', plano);
        return response.json('sucesso');
    },
    async EditarAssinatura(request, response){
        const {assinatura, cpf} = request.body;
        await connect('salao').where('cpf_salao', cpf).select('*').update('assinatura', assinatura);
        return response.json('sucesso');
    },
    async EditarAssinaturaStatus(request, response){
        const {cpf, assinatura_status} = request.body;
        await connect('salao').where('cpf_salao', cpf).select('*').update('assinatura_status', assinatura_status);
        return response.json("sucesso");
    },
    async DataInicio(request, response){
        const {data_inicio_plano, cpf} = request.body;
        await connect('salao').where('cpf_salao', cpf).select('*').update('data_inicio_plano', data_inicio_plano);
        return response.json("sucesso");
    },
    async DataFim(request, response){
        const {data_vencimento_plano, cpf} = request.body;
        await connect('salao').where('cpf_salao', cpf).select('*').update('data_vencimento_plano', data_vencimento_plano);
        return response.json('sucesso');
    },
    async FuncionarioLimite(request, response){
        const {limite_funcionarios, cpf} = request.body;
        await connect('salao').where('cpf_salao', cpf).select("*").update('limite_funcionarios', limite_funcionarios);
        return response.json('sucesso');
    }
};