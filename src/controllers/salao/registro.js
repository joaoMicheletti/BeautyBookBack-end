//imprtar connecção com o banco de dados;
const connect = require('../../database/connection');
const crypto = require('crypto');
module.exports = {
    // função responsável por regitrar os salões;
    async Registrar(request, response){
        const {
            cpf_salao,
            nome_salao,
            endereco,
            cep,
            email,
            senha,
            data_cadastro,
            indicado_por
        } = request.body;
        var codigo_indicacao = crypto.randomBytes(3).toString('HEX');
        var dias_free = 7;
        const Data = {
            cpf_salao,
            nome_salao,
            endereco,
            cep,
            email,
            senha,
            dias_free,
            data_cadastro,
            codigo_indicacao,
            indicado_por
        };
        var RespCadastro = await connect('salao').insert(Data);
        if(RespCadastro.length > 0){
            return response.send('cadastrado Com sucesso!');
        } else if(RespCadastro.length === 0){
            return response.json('Erro ao Cadastrar SAlão.');
        } else{
            return response.json('Erro interno');
        };
        
        return response.json(Data);
    },
    //listando os saloes cadastrados :
    async ListarSalao(request, response){
        const Lista = await connect('salao').select('*');
        return response.json(Lista);
    },
}