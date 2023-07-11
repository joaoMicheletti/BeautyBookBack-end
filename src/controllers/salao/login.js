const connect = require('../../database/connection');
module.exports = {

    async LoginSalao(request, response){
        
        const {cpf_salao, senha} = request.body; 
        // buscando os dados recebidos pelo corpo da reques ;
        const cCpf = await connect('salao').where('cpf_salao', cpf_salao).select('cpf_salao');
        const cSenha = await connect('salao').where('cpf_salao', cpf_salao).select('senha');
        //tratando esses dados;
        if(cCpf.length === 0){ //si for (0) o cpf_salao não foi encontrado no databese;
            // faça uma busca na tabela funcionarios;
            const funcionario = await connect('funcionarios').where('cpf_funcionario', cpf_salao).select('cpf_funcionario');
            if(funcionario.length === 0){ // si for (0) o cpf_funcionario não foi encontrado;
                return response.json('não encontramos nenhum salão ou funcionário com esses dados!');
            } else { // achamos o copf_funcionario na tabela, valide a senha;
                const senha_funcionario = await connect('funcionarios').where('cpf_funcionario', cpf_salao)
                .where('senha', senha).select('senha');
                
                if(senha_funcionario.length === 0){ // si for (0) não achamos a senha no database; 
                    return response.json('erro no login.');
                } else { // si chegamos aqui passou en todas as verificações como funcionário;
                    const Data = {
                        cpf_funcionario: funcionario[0].cpf_funcionario
                    }
                    //retorne um objeto com a propriedade cpf_fucionario;
                    return response.json(Data);
                };
            };
        } else if(cSenha[0].senha != senha ){
            return response.json('erro no login');
        } else { // si chegou aqui passou en todas as verificações como salão;
            //retorne um objeto com a propriedade cpf_salao;
            const Data = {
                cpf_salao
            };
            return response.json(Data);
        }
    },
}