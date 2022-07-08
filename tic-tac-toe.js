const gameBoardModule = (function() {
  const gameBoardArray = [];
  const makeBoardCell = function(id, value, row, column) {
      return {id, value, row, column}
  };
  const makeBoardModule = function() {
      for(let i=0; i<9; i++) {
          let id = 'r' + Math.floor(i/3) + 'c' + i%3;
          let cell = makeBoardCell(id, null, 'r' + Math.floor(i/3), 'c' + i%3);
          gameBoardArray.push(cell);
      }
  };
  const setCellValue = function(searchId, setValue) {
      gameBoardArray.forEach(function(cell) {
          if (cell.id === searchId) {
              cell.value = setValue;
          }
      })
  };
  const showActiveCells = function() {
      return gameBoardArray.filter(cell => cell.value);
  };
  const clearGameBoardArray = function() {
      gameBoardArray.length = 0;
  }
  return {makeBoardModule, showActiveCells, setCellValue, clearGameBoardArray};
})();

const Player = function(name, sign, state) {
  let score = 0;
  let active = state;
  let endGame = false;
  const getName = () => name;
  const getSign = () => sign;
  const addScore = () => score++;
  const getScore = () => score;
  const toggleState = function() {
      active = !active;
  };
  const getState = () => active;
  const toggleEndGame = function() {
      endGame = !endGame;
  };
  const getEndGame = () => endGame;
  return {getName, getSign, addScore, getScore, toggleState, getState, toggleEndGame, getEndGame}
};

const gamePlay = (function() {
  const startPlay = function(e) {
      button.removeEventListener('click', startPlay);
      button.classList.toggle('not-active');
      gameBoardModule.clearGameBoardArray();
      gameBoardModule.makeBoardModule();
      svg.forEach(cell => cell.classList.add('invisibility'));
      cells.forEach(cell => cell.classList.remove('winner'));
      cells.forEach(cell => cell.parentElement.classList.remove('add-background'));
      player2ScoreBoard.forEach(div => div.classList.toggle('not-active'));
      message.textContent = `${player1.getName()} begins`;
      cells.forEach((cell) => cell.addEventListener('click', onePlay));
  }  
  const onePlay = function(e) {
      const showActivePlayer = (function() {
          const playerScoreBoard = document.querySelectorAll('.player');
          playerScoreBoard.forEach(div => div.classList.toggle('not-active'));
          const getScoreBoard = () => playerScoreBoard;
          return {getScoreBoard};
      })(); 
      const freezeBoard = function() {
          cells.forEach(cell => cell.removeEventListener('click', onePlay));
          showActivePlayer.getScoreBoard().forEach(div => div.classList.remove('not-active'));
          button.addEventListener('click', startPlay);
          button.classList.toggle('not-active');
          if (!player1.getState()) {
              player1.toggleState();
          }
      };
      const displayScore = function() {
          player1Score.textContent = player1.getScore();
          player2Score.textContent = player2.getScore();        
      };
      const displayMessage = function(player) {
          message.textContent = `${player.getName()} wins! Press START to play again.`;
      };

      const setMark = (function() {
          if (player1.getState() === true) {
              e.target.lastElementChild.classList.toggle('invisibility');
              gameBoardModule.setCellValue(e.target.id, 'x');
              message.textContent = `${player2.getName()}'s turn`;
          } else {
              e.target.firstElementChild.classList.toggle('invisibility');
              gameBoardModule.setCellValue(e.target.id, 'o');
              message.textContent = `${player1.getName()}'s turn`;
          };
          console.log(e.target.firstElementChild, e.target.lastElementChild);
          e.target.removeEventListener('click', onePlay);
          player1.toggleState();
      })();

      const markPlayer = function(mark) {
          if (mark === 'x') {
              player1.addScore();
              displayMessage(player1);
          } else {
              player2.addScore();
              displayMessage(player2);
          };
          displayScore();
          freezeBoard();
      };

      let activeCells = gameBoardModule.showActiveCells();
      const checkStraight = function(mark, rowColumn) {
          let markArray = activeCells.filter(cell => cell.value === `${mark}`);
          let rowColumnArray = markArray.map(cell => cell[`${rowColumn}`]);
          console.log(rowColumnArray);
          let TriplesArray = rowColumnArray.filter((item, idx) => rowColumnArray.indexOf(item) !== idx);
          console.log(TriplesArray);
          const showWinningCells = function() {
              const cells = document.querySelectorAll(`[data-${rowColumn}="${TriplesArray[0]}"]`);
              return cells;
          }
          if (TriplesArray.length === 2 && TriplesArray[0] === TriplesArray[1]) {
              markPlayer(mark);
              const winningCells = showWinningCells();
              winningCells.forEach(cell => cell.classList.add('winner'));
              winningCells.forEach(cell => cell.parentElement.classList.add('add-background'));
              return;
          };
      };
      const checkDiagonal = function(mark) {
          let markArray = activeCells.filter(cell => cell.value === `${mark}`);
          const showWinningDiagonalCell = function(id) {
              const cell = document.querySelector(id);
              cell.classList.add('winner');
              cell.parentElement.classList.add('add-background');
          }
          let middleCell = markArray.filter(cell => cell.id === "r1c1");
          if (middleCell.length === 0) {return};
          console.log(middleCell);
          let r0c0 = markArray.filter(cell => cell.id === "r0c0");
          let r2c2 = markArray.filter(cell => cell.id === "r2c2");
          let r0c2 = markArray.filter(cell => cell.id === "r0c2");
          let r2c0 = markArray.filter(cell => cell.id === "r2c0");
          if (r0c0.length === 1 && r2c2.length === 1) {
              markPlayer(mark);
              const idArray = ["#r0c0", "#r2c2", "#r1c1"];
              console.log(idArray);
              idArray.forEach(id => showWinningDiagonalCell(id));
              return;
          } else if (r0c2.length === 1 && r2c0.length === 1) {
              markPlayer(mark);
              const idArray = ["#r0c2", "#r2c0", "#r1c1"];
              console.log(idArray);
              idArray.forEach(id => showWinningDiagonalCell(id));
              return;
          }
      };
      let xRow = checkStraight('x', 'row');
      let oRow = checkStraight('o', 'row');
      let xColumn = checkStraight('x', 'column');
      let oColumn = checkStraight('o', 'column');
      let xDiagonal = checkDiagonal('x');
      let oDiagonal = checkDiagonal('o');                     
  };
  return {startPlay, onePlay};
})();

const player1Name = prompt("Player 1, please enter your name:");
const player2Name = prompt("Player 2, please enter your name:");
const player1 = Player(player1Name, 'x', true);
const player2 = Player(player2Name, 'o', false);
const player1ScoreBoardName = document.querySelector('.player1.name');
const player2ScoreBoardName = document.querySelector('.player2.name');
player1ScoreBoardName.textContent = `${player1.getName()} (X)`;
player2ScoreBoardName.textContent = `${player2.getName()} (O)`;
const cells = document.querySelectorAll('.cell');
const button = document.querySelector('button');
const message = document.querySelector('.message.content');
const player1Score = document.querySelector('.player1.score');
const player2Score = document.querySelector('.player2.score');
const svg = document.querySelectorAll('svg');
const player2ScoreBoard = document.querySelectorAll('.player2');
button.addEventListener('click', gamePlay.startPlay);
