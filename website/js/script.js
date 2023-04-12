var state = {
  board: [],
  currentGame: [],
  savedGames: [],
};

function start() {
  readlocalStorage();
  createBoard();
  newGame();
}

function readlocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savedGamesFromLocalStorage = window.localStorage.getItem(
    "saved-megasena-games"
  );
  if (savedGamesFromLocalStorage) {
    state.savedGames = JSON.parse(savedGamesFromLocalStorage);
  }
}

function writeToLocalStorage() {
  window.localStorage.setItem(
    "saved-megasena-games",
    JSON.stringify(state.savedGames)
  );
}

function clearLocalStorage() {
  state.savedGames = [];
  window.localStorage.clear()
  render();
}


function createBoard() {
  state.board = [];

  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

function newGame() {
  resetGame();
  render();
}
function render() {
  renderBoard();
  renderButtons();
  renderSaveGames();
}
function renderBoard() {
  var divGame = document.querySelector("#megasena-board");
  divGame.innerHTML = "";

  var ulNumbers = document.createElement("ul");
  ulNumbers.classList.add("numbers");
  state.board.forEach((numero) => {
    var liNumber = document.createElement("li");
    liNumber.textContent = numero;
    liNumber.classList.add("number");

    liNumber.addEventListener("click", hendleNumberClick);
    if (isNumberInGame(numero)) {
      liNumber.classList.add("selected-number");
    }
    ulNumbers.appendChild(liNumber);
  });

  divGame.appendChild(ulNumbers);
}
function renderButtons() {
  var divButtons = document.querySelector("#megasena-buttons");
  divButtons.innerHTML = "";

  var buttonNewGame = renderNewGameButton();
  var buttonRandomGame = renderRandomGameButton();
  var buttonSavedGame = renderSaveGameButton();
  var buttonClearSavedGamesLocalStorage = renderClearSavedGamesButton();

  divButtons.appendChild(buttonNewGame);
  divButtons.appendChild(buttonRandomGame);
  divButtons.appendChild(buttonSavedGame);
  divButtons.appendChild(buttonClearSavedGamesLocalStorage);
}
function renderSaveGames() {
  var divSalvedGames = document.querySelector("#megasena-saved-games");
  divSalvedGames.innerHTML = "";
  if (state.savedGames.length === 0) {
    divSalvedGames.innerHTML = "<p>Nenhum jogo salvo.</p>";
  } else {
    var ulSavedGames = document.createElement("ul");

    state.savedGames.forEach((item) => {
      var liSavedGame = document.createElement("li");
      liSavedGame.textContent = item.join(" - ");

      ulSavedGames.appendChild(liSavedGame);
    });

    divSalvedGames.appendChild(ulSavedGames);
  }
}

function renderNewGameButton() {
  var button = document.createElement("button");
  button.textContent = "Novo Jogo";
  button.addEventListener("click", newGame);

  return button;
}
function renderRandomGameButton() {
  var button = document.createElement("button");
  button.textContent = "Jogo Aleatório";
  button.addEventListener("click", randomGame);
  return button;
}

function renderSaveGameButton() {
  var button = document.createElement("button");
  button.textContent = "Salvar jogo";
  button.disabled = !isGameComplete();
  button.addEventListener("click", saveGame);
  return button;
}

function renderClearSavedGamesButton() {
  var button = document.createElement("button");
  button.textContent = "Excluir Jogos Salvos";
  button.disabled = !state.savedGames.length >0;
  button.addEventListener("click", clearLocalStorage);

  return button;
}




function randomGame() {
  resetGame();
  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);

    addNumberToGame(randomNumber);
  }
  render();
}

function hendleNumberClick(event) {
  var value = Number(event.currentTarget.textContent);

  isNumberInGame(value) ? removeNumberFromGame(value) : addNumberToGame(value);
  render();
}

function addNumberToGame(numberToAdd) {
  if (numberToAdd < 1 || numberToAdd > 60) {
    console.error("Número inválido.", numberToAdd);
    return;
  }

  if (state.currentGame.length >= 6) {
    console.error("O jogo já está completo.");
    return;
  }
  if (isNumberInGame(numberToAdd)) {
    console.error("Este número já está no jogo.", numberToAdd);
    return;
  }

  state.currentGame.push(numberToAdd);
}

function removeNumberFromGame(numberToRemove) {
  /**    var newGame = [];
    for(var i in state.currentGame){
        if(i != numberToRemove) newGame.push(state.currentGame[i])
        console.log(i);
    }
    state.currentGame = newGame;
 */
  //if (numberToRemove < 1 || numberToRemove > 60) return;

  var newGame = [];
  state.currentGame.forEach((element) => {
    if (element !== numberToRemove) newGame.push(element);
  });
  state.currentGame = newGame;
}

function isNumberInGame(numberToCheck) {
  return state.currentGame.includes(numberToCheck);
}

function saveGame() {
  if (!isGameComplete()) {
    return;
  }

  state.savedGames.push(state.currentGame.sort((a, b) => a - b));
  writeToLocalStorage();
  newGame();
}
function isGameComplete() {
  return state.currentGame.length === 6;
}
function resetGame() {
  state.currentGame = [];
}
start();
