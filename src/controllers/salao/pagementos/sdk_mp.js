// SDK do Mercado Pago
const mercadopago = require ('mercadopago');
module.exports = {
  async Preferenceid(request, response){
    const {plano, preco} = request.body
    console.log(plano, preco);
    // Configure as credenciais
    mercadopago.configure({
      access_token: 'APP_USR-8723383960512742-032820-a2fe03f8211f0538df7bb3b7177ebc42-294751990' //chave de acesso de teste
    });
    // Crie um objeto de preferência
    let preference = {
      back_urls: {
        "success": "http://localhost:3000/aprovado",
        "failure": "http://localhost:3000/recusado",
        "pending": "http://localhost:3000/pendente/"
      },
      "auto_return": "all",
      items: [
        {
          title: plano,
          unit_price: preco,
          quantity: 1,
        },
      ]
    };
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
        console.log(Dados);
        console.log(Dados.status); //status do pagamento pending, failure, success;
        console.log(Dados.description); // nome do produto ou seja nome do plano contratado;
        return response.json(Dados.status);
      }else{
        console.log('Tratar aqui estatus not pending');
      };
        
      }).catch((error) => {
        console.error('Erro na solicitação:', error);
      });
    },
}