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
                // verificar o pagamento e atualizar se realizado;
                var pending = await connect('salao').where('cpf_salao', cpf_salao).select('pendente');
                if(pending[0].pendente !== null){
                    var paymentId = pending[0].pendente;
                    console.log('>>>', paymentId);
                    const axios = require('axios');
                    const YOUR_ACCESS_TOKEN = 'APP_USR-8723383960512742-032820-a2fe03f8211f0538df7bb3b7177ebc42-294751990'; // Substitua pelo seu token de acesso
                    const apiUrl = `https://api.mercadopago.com/v1/payments/${paymentId}`;
                    const config = {
                    headers: {
                        Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`,
                        },
                    };
                    axios.get(apiUrl, config).then((Response) => {
                    const Dados = Response.data;
                    if(Dados.status === 'pending'){
                        //retornando o status e o tipo do pagament;
                        var statusPagamento = Dados.status;
                        const Data = {
                            cpf_salao,
                            statusPagamento,
                        };
                        return response.json(Data);
                    }else if(Dados.status === 'approved'){
                        //data de aprovação do pagamento;
                        var dataAproved =  Dados.date_approved;
                        // data de termino do plano do salão;
                        var terminoPlano = async  () => {
                            await connect('salao').where('cpf_salao', cpf_salao).select('data_vencimento_plano');
                        };
                        //quebrando a string para gerar um objeto de Date();
                        var partes = terminoPlano.split('/');
                        var diaTermino = parseInt(partes[0], 10);
                        var mesTermino = parseInt(partes[1], 10); // Os meses em JavaScript são baseados em zero
                        var anoTermino = parseInt(partes[2], 10); 
                        //objeto de date com a data de termino do plano;
                        var objetoDataDeTerminoDoPlano = new Date(diaTermino, mesTermino, anoTermino);
                        //criando objeto de aprovaçõa de pagamento para converter para dia, mes, ano;
                        var dataPagamento = new Date(dataAproved);
                        var diaPagamento = dataPagamento.getDate();
                        var mesPagamento= dataPagamento.getMonth();
                        var anoPagamento = dataPagamento.getFullYear();
                        // nova tada de termino de plano;
                        var varTerminoDePlano = dia+'/'+mes+'/'+ano;
                        //objeto da data da aprovação para a conparação;
                        var objetodataDeAprovacaoDePagamento = new Date(diaPagamento, mesPagamento, anoPagamento);
                        //condição para ferivicar se objetoDataDeTerminoDoPlano é < que dataDeAprovacaoDePagamento;
                        if(objetoDataDeTerminoDoPlano < objetodataDeAprovacaoDePagamento){
                            var updateInicioDoPlano = async () => {
                                var objetDataAtual = new Date();
                                var diaInicioDeplano = objetDataAtual.getDate();
                                var mesInicioDePlano = objetDataAtual.getMonth() + 1;
                                var anoInicioDePlano = objetDataAtual.getFullYear();
                                // nova data de inicio de plano;
                                var varInivioDeplano = diaInicioDeplano+'/'+mesInicioDePlano+'/'+anoInicioDePlano;
                                // atualizando na base de dados;
                                await connect('salao').where('cpf_salao', cpf_salao).update('data_inicio_plano', varInivioDeplano);
                                //atualizndo a data de termino na base de dados;
                                await connect('salao').where('cpf_salao', cpf_salao).update('data_vencimento_plano', varTerminoDePlano);
                                // atualizando o status da assinatura
                                await connect('salao').where('cpf_salao', cpf_salao).update('assinatura_status', 'on');
                                //removendo o paymentId da base de dados;
                                await connect('salao').where('cpf_salao', cpf_salao).update('pendente', null);
                            };
                        };
                        var statusPagamento = Dados.status;
                        const Data = {
                            cpf_salao,
                            statusPagamento,
                        };
                        return response.json(Data);
                    }else{
                        var statusPagamento = Dados.status;
                        const Data = {
                            cpf_salao,
                            statusPagamento,
                        };
                        return response.json(Data);
                    };        
                    }).catch((error) => {
                        console.error('Erro na solicitação:', error);
                    });
                };
                
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
            await connect('salao').where('cpf_salao', cpf_salao).update('assinatura_status', 'off');
            return respones.json(null);
        };
        //busca na base dedados.
        const ass = await connect('salao').where('cpf_salao', cpf_salao).select('assinatura_status');
        return respones.json('on');
    },
};