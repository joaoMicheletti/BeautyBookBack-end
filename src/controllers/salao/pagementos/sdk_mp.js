// SDK do Mercado Pago
const mercadopago = require ('mercadopago');
const connect = require('../../../database/connection');
const { verbose } = require('sqlite3');
module.exports = {
  // criando a preferência do produto
  async Preferenceid(request, response){
    const {plano, quantidade, preco, x} = request.body
    var Preco = 0;
    if(plano === 'plano individual'){
      Preco += 50;
    } else if(plano === "plano personalizado"){
      Preco += x * 50;
    }
    console.log(plano, quantidade, Preco, x);
    // Configure as credenciais
    mercadopago.configure({
      access_token: 'APP_USR-8723383960512742-032820-a2fe03f8211f0538df7bb3b7177ebc42-294751990' //chave de acesso de teste
    });
    // Crie um objeto de preferência
    let preference = {
      back_urls: {
        "success": "http://localhost:3000/pendente/",
        "failure": "http://localhost:3000/pendente/",
        "pending": "http://localhost:3000/pendente/"
      },
      "auto_return": "all",
      items: [
        {
          title: plano,
          quantity: parseInt(quantidade),
          'currency_id': 'BRL',
          unit_price: Preco,
        },
      ]
    };
    console.log(">>>>", preco);
    mercadopago.preferences.create(preference)
    .then(function(Response){
    // Este valor substituirá a string "<%= global.id %>" no seu HTML
      global.id = Response.body.id;
      console.log(global.id);
      return response.json(global.id);
    }).catch(function(error){
      console.log(error);
    });
  },
  //função para buscar um pagamento;
  async BuscarPagamento(request, response){
    const {paymentId} = request.body;
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
        console.log(Dados); //objeto completo de resposta do banco 
        console.log(Dados.status); //status do pagamento pending, failure, success;
        console.log(Dados.description); // nome do produto ou seja nome do plano contratado;
        console.log(Dados.payment_method.id); // tipo de pagamneto
        //retornando o status e o tipo do pagament;
        var status = Dados.status;
      var id = Dados.payment_method.id;
        const Resp = {status, id};
        return response.json(Resp);
      }else if(Dados.status === 'approved'){
        var status = Dados.status;
        var description = Dados.description; 
        const Data = {
          status,
          description          
        };
        console.log(Data);
        return response.json(Data);
      }else{
        response.json('recusado');
      };        
      }).catch((error) => {
        console.error('Erro na solicitação:', error);
      });
    },
    //função responsável por salvar o pymentId no data base;
    //caso o pagamento sejá pendente, boleto ou pec;
    async Pending(request, response){
      const {salao, paymentId} = request.body;
      //inserindo o pymentId no dataBase;
      var verificar = await connect('salao').where('cpf_salao', salao).update('pendente', paymentId);
      console.log(verificar);
      return response.json(verificar);
    },
};