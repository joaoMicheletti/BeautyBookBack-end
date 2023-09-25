// SDK do Mercado Pago
const mercadopago = require ('mercadopago');
module.exports = {
  async Preferenceid(request, response){
    const {plano, preco} = request.body
    console.log(plano, preco);
    // Configure as credenciais
    mercadopago.configure({
      access_token: '' //chave de acesso de teste
    });
    // Crie um objeto de preferência
    let preference = {
      items: [
        {
          title: plano,
          unit_price: preco,
          quantity: 1,
        }
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
}


