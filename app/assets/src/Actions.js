function zipcodeMask(event) {
  const value = event.currentTarget.value;
  const valueWithoutInvalidCharacters = value.replace(/\D/g, "");
  const valueWithMask = valueWithoutInvalidCharacters.replace(/^(\d{5})(\d)/, "$1-$2");
  event.currentTarget.value = valueWithMask;
  return event;
}

function resetStateComponents() {
  const zipcodeInput = document.getElementById('zipcode');
  const textErrorInput = document.getElementById('textError');

  textErrorInput.style.display = "none";
  zipcodeInput.style.borderColor = "#9e9e9e";
}

function showError() {
  const zipcodeInput = document.getElementById('zipcode');
  const textErrorInput = document.getElementById('textError');

  textErrorInput.style.display = "block";
  zipcodeInput.style.borderColor = "#a83232";

  stopLoading();
}

function addressFormat(address) {
  return `Rua: ${address.logradouro}, Bairro: ${address.bairro}, ${address.localidade} - ${address.uf} | CEP: ${address.cep}`
}

function startLoading() {
  const submitButton = document.getElementById('submit');
  const loading = document.getElementById('loading');


  submitButton.style.display = 'none';
  loading.style.display = 'block';
}

function stopLoading() {
  const submitButton = document.getElementById('submit');
  const loading = document.getElementById('loading');


  submitButton.style.display = 'block';
  loading.style.display = 'none';
}


async function handleForm() {
  const zipcodeInputValue = document.getElementById('zipcode').value;

  startLoading();
  resetStateComponents();

  if(zipcodeInputValue.length < 9) return showError();

  const responseViaCep = await fetch(`https://viacep.com.br/ws/${zipcodeInputValue}/json/`);

  const address = await responseViaCep.json();
  
  if (address.erro) return showError();

  let client = ZAFClient.init();

  const context = await client.context();

  await client.request({
    url: `/api/v2/tickets/${context.ticketId}`,
    type: 'PUT',
    data: {
      "ticket": {
        "comment": {
          "body": addressFormat(address),
          "public": true
        },
        "status": "solved"
      }
    }
  });

  stopLoading();
}


