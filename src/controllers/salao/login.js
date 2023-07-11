const connect = require('../../database/connection');
module.exports = {

    async LoginSalao(request, response){
        // falta fazer a verificação dos dias free 
        //cada salão novo no sistema terá uma semana, (7) dias de acesso livre
        //passado esses 7 dias ele so terá acesso a pagina de planos até contratar um .
        
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
                    //verificar à assinatura do salão en que o funcionário encontra-se cadastrado;
                    const salao =  await connect('funcionarios').where('cpf_funcionario', cpf_salao).select('cpf_salao');
                    var cpfsalao = salao[0].cpf_salao;
                    const status = await connect('salao').where('cpf_salao', cpfsalao).select('assinatura_status');

                    if(status[0].assinatura_status === 'on'){
                        const Data = {
                            cpf_funcionario: funcionario[0].cpf_funcionario,
                        };
                        //retorne um objeto com a propriedade cpf_fucionario;
                        return response.json(Data);
                    } else {
                        //para o salão que encontra-se com o plano inativo os funncionários não terao acesso ao sistema;
                        return response.json('Acesso Negado!')
                    }
                    
                };
            };
        } else if(cSenha[0].senha != senha ){
            return response.json('erro no login');
        } else { // si chegou aqui passou en todas as verificações como salão;
            //retorne um objeto com a propriedade cpf_salao;
            // retorne o status do plano, aregra de negócio só  deixara o salão ter acesso a pagina de planos.
            const status = await connect('salao').where('cpf_salao', cpf_salao).select('assinatura_status');
            console.log(status)
            var assinatura_status = status[0].assinatura_status;
            const Data = {
                cpf_salao,
                assinatura_status
            };
            return response.json(Data);
        }
    },
}