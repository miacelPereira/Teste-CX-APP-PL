import Core from "./Core.js";

const client = ZAFClient.init();

let settings;

client.metadata().then((metadata) => {
  settings = metadata.settings;
});

const Main = async () => {
  const App = document.getElementById("app");
  let appBody = `
    <div id="main-content">
      <form onsubmit="return false">
        <input type="text" maxlength="9" id="zipcode" placeholder="Digite o CEP" onKeyUp="zipcodeMask(event)"/>
        <p id="textError"> Informe um cep válido </p>
        <button type="submit" onclick="handleForm()" id="submit"> Buscar </Button>
        <img src="./images/loading.gif" id="loading" />
      </form>
    </div>`;

  // Write App
  App.innerHTML = appBody;
};

export default Main;
