// SDK do Mercado Pago
const mercadopago = require ('mercadopago');
// Adicione as credenciais
mercadopago.configure({
  access_token: 'PROD_ACCESS_TOKEN' // chave privada;
});

// Cria um objeto de preferência
let preference = {
    items: [
      {
        title: 'Meu produto',
        unit_price: 100,
        quantity: 1,
      }
    ]
  };
  
  mercadopago.preferences.create(preference)
  .then(function(response){
    global.id = response.body.id;
  }).catch(function(error){
    console.log(error);
  });