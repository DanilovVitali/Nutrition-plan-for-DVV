// Зберегти як dev-menu.js і відкрити в браузері
// Цей файл допоможе подивитись, що відбувається у вашому застосунку

document.body.innerHTML = `
<h1>Меню розробника DVV Meal Plan</h1>
<style>
  body { 
    font-family: sans-serif; 
    margin: 20px; 
    background: #111; 
    color: white;
  }
  h1 { color: #ff0000; }
  button {
    background: #333;
    color: white;
    border: 1px solid #ff0000;
    padding: 8px 15px;
    margin: 10px 0;
    cursor: pointer;
  }
  pre {
    background: #222;
    padding: 10px;
    border-radius: 5px;
    max-height: 400px;
    overflow: auto;
  }
</style>

<div>
  <h2>Діагностика</h2>
  <button onclick="checkReactRouter()">Перевірити React Router</button>
  <button onclick="checkPackages()">Перевірити встановлені пакети</button>
  <button onclick="checkRoutes()">Перевірити маршрути</button>
  <button onclick="checkServer()">Перевірити сервер</button>
  <button onclick="loadApp()">Відкрити додаток</button>
  <div id="result"></div>
</div>
`;

function showResult(text) {
  document.getElementById('result').innerHTML = `<pre>${text}</pre>`;
}

function checkReactRouter() {
  fetch('/node_modules/react-router-dom/package.json')
    .then(response => response.text())
    .then(text => {
      showResult("React Router DOM знайдено!\n\n" + text);
    })
    .catch(error => {
      showResult("Помилка: React Router DOM не знайдено\n\n" + error);
    });
}

function checkPackages() {
  fetch('/package.json')
    .then(response => response.text())
    .then(text => {
      showResult("Пакети:\n\n" + text);
    })
    .catch(error => {
      showResult("Помилка: не вдалося перевірити пакети\n\n" + error);
    });
}

function checkRoutes() {
  fetch('/src/App.tsx')
    .then(response => response.text())
    .then(text => {
      showResult("Маршрути у App.tsx:\n\n" + text);
    })
    .catch(error => {
      showResult("Помилка: не вдалося перевірити маршрути\n\n" + error);
    });
}

function checkServer() {
  fetch('/')
    .then(response => {
      showResult(`Статус сервера: ${response.status} ${response.statusText}`);
    })
    .catch(error => {
      showResult("Сервер недоступний\n\n" + error);
    });
}

function loadApp() {
  window.location.href = '/';
} 