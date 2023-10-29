const connect = require('../../database/connection');
module.exports = {
    async LoginSalao(request, response){
        //cada salão novo no sistema terá uma semana, (7) dias de acesso livre
        //passado esses 7 dias ele so terá acesso a pagina de planos até contratar um .
        
        const {cpf_salao, senha} = request.body;
        // buscando os dados recebidos pelo corpo da request ;
        const cCpf = await connect('salao').where('cpf_salao', cpf_salao).select('cpf_salao');
        const cSenha = await connect('salao').where('cpf_salao', cpf_salao).select('senha');
        //tratando esses dados;
        if(cCpf.length === 0){ //si for (0) o cpf_salao não foi encontrado no databese;
            // faça uma busca na tabela funcionarios;
            const funcionario = await connect('funcionarios').where('cpf_funcionario', cpf_salao).select('cpf_funcionario');
            if(funcionario.length === 0){ // si for (0) o cpf_funcionario não foi encontrado;
                return response.json('não encontramos nenhum salão ou funcionário com esses dados!');
            } else { // achamos o cpf_funcionario na tabela, valide a senha;
                const senha_funcionario = await connect('funcionarios').where('cpf_funcionario', cpf_salao)
                .where('senha', senha).select('senha');
                
                if(senha_funcionario.length === 0){ // si for (0) não achamos a senha no database; 
                    return response.json('erro no login');
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
                        return response.json('Acesso Negado, problemas com à assinatura do plano.');
                    };                    
                };
            };
        } else if(cSenha[0].senha != senha ){
            return response.json('erro no login');
        } else { // si chegou aqui passou en todas as verificações como salão;
            //retorne um objeto com a propriedade cpf_salao;
            // retorne o status do plano, caso sejá off o salão só terá acesso a pegina d planos .
            const status = await connect('salao').where('cpf_salao', cpf_salao).select('assinatura_status');
            
            /*salão com a assinatura_status = null ou sejá novos na plataforma,
            será liberado 7 dias corridos livres com algumas restrições.
            passado esse período o salão não terá mais acesso as funcionalidades da nossa plataforma
            terá scesso somente a pagina de planos para ativar o seu cadastro.
            */
            if(status[0].assinatura_status === null){ //verificar os diad free;
                //data de cadastro do salão
                const dataCadastro = await connect('salao').where('cpf_salao', cpf_salao).select('data_cadastro');
                //data atual
                var dataAtual = new Date();  
                var dataString = dataCadastro[0].data_cadastro;
                // Quebrar a string da data em dia, mês e ano
                var partes = dataString.split('/');
                var dia = parseInt(partes[0], 10);
                var mes = parseInt(partes[1], 10) - 1; // Os meses em JavaScript são baseados em zero
                var ano = parseInt(partes[2], 10);
                // Criar um objeto de data com os valores obtidos
                var data = new Date(ano, mes, dia);
                // Adicionar 7 dias ao objeto de data
                data.setDate(data.getDate() + 7);
                //salvando na variavel o status dos dias free, true para acesso livre false para acesso livre excedido;
                var dias_free = dataAtual < data;
                // adicionar retorno de dias free exedido
                if(dias_free === true){
                	// dias free disponivél ainda.
                    const Data = {
                    cpf_salao,
                    };
                    return response.json(Data);
                } else{
                	// dias free exedidos.
                    return response.json("Dias Free exedidos");
                };  
            } else {
                var assinatura_status = status[0].assinatura_status;
                const Data = {
                    cpf_salao,
                    assinatura_status
                };
                return response.json(Data);
            };            
        };
    },
    //função responsavél por verificar se o salão esta com assinatura ativa = 'on';
    async statusAssinatura(request, respones){
        const {cpf_salao} = request.body; // req do front
        //como essa função vai ser chamada constantemente ela tratara de verificar a data de termino de assinatur e etualizar o status de assinatura;
        //data de vencimento do plano do salão.
        let dataVencimento = await connect('salao').where('cpf_salao', cpf_salao).select('data_vencimento_plano');
        //verificar se os dis free ainda estão liberados.
        if(dataVencimento[0].data_vencimento_plano === null){
            // si for nul não, ainda nao contratou nenum plano, então verificaremos os dis free;
            var dataAtual = new Date();
            var cad = await connect('salao').where('cpf_salao', cpf_salao).select('data_cadastro');
            var partes = cad[0].data_cadastro.split('/');
                var dia = parseInt(partes[0], 10);
                var mes = parseInt(partes[1], 10) - 1; // Os meses em JavaScript são baseados em zero
                var ano = parseInt(partes[2], 10);
                // Criar um objeto de data com os valores obtidos
                var data = new Date(ano, mes, dia);
                // Adicionar 7 dias ao objeto de data
                data.setDate(data.getDate() + 7);
                //salvando na variavel o status dos dias free, true para acesso livre false para acesso livre excedido;
                var dias_free = dataAtual < data;
                return respones.json(dias_free)
        }
        // Quebrar a string da data vencimento em dia, mês e ano
        var partes = dataVencimento[0].data_vencimento_plano.split('/');
        var Dia = parseInt(partes[0], 10);
        var Mes = parseInt(partes[1], 10) - 1 ; // Os meses em JavaScript são baseados em zero
        var Ano = parseInt(partes[2], 10);
        const dataVencimentobject = new Date(Ano, Mes, Dia);
        // data Atual;
        const DataAtual = new Date();
        var dia = DataAtual.getDate();
        var mes = DataAtual.getMonth();
        var ano = DataAtual.getFullYear();
        const dataAtualObject = new Date(ano, mes, dia);
        //foi criado dois objetos de data para facilitar na conparação das datas 
        if(dataAtualObject > dataVencimentobject){
            await connect('salao').where('cpf_salao', cpf_salao).update('assinatura_status', null);
            return respones.json(null);
        };
        //busca na base dedados.
        const ass = await connect('salao').where('cpf_salao', cpf_salao).select('assinatura_status');
        return respones.json('on');
    },
}
