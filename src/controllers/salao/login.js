const connect = require('../../database/connection');
module.exports = {

    async LoginSalao(request, response){
        
        const {cpf, senha} = request.body;

        const cCpf = await connect('salao').where('cpf', cpf).select('cpf');
        const cSenha = await connect('salao').where('cpf', cpf).select('senha');
        if(cCpf.length === 0){
            return response.json('Salão não encontrado');
        } else if(cSenha[0].senha != senha ){
            return response.json('Erro no login');
        } else {
            return response.json('login ok');
        }
    },
}