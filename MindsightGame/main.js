import { Shape } from './shape.js';
import { ShapeManager } from './ShapeManager.js';
import { GameManager } from './GameManager.js';
import { shapePaths } from './AssetsPath.js';
import { setCalibrateButtonActive } from './CalibrateManager.js';
import { setCalibrateContainerActive } from './CalibrateManager.js';
import { startCalibrating } from './CalibrateManager.js';

const startBtn = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-score');
const playAgainBtn = document.getElementById('playAgain-button');
const endCalibrateBtn = document.getElementById('end-calibrate-button');
const roundCounter = document.getElementById('round-counter');
const roundBoard = document.getElementById('round-board');

let shapeManager; 
let gameManager;

(() => {
    shapeManager = new ShapeManager('shape-text', 'shape-image');
    gameManager = new GameManager();
    setupGameUI();
})();

function setElementActive(container, active) {
    var value = active == true ? 'block' : 'none';
    container.style.display = value;
}

function displayResult(score, totalRound){
    setElementActive(resultContainer, true);
    resultText.textContent = score + "/" + totalRound;
    renderRoundBoard();
}

function handleShapeClick(buttonId) {

  gameManager.setCurrentRoundShape(shapeManager.currentShape);

  if (buttonId === shapeManager.currentShape.name) {
    gameManager.increasePoint();
    gameManager.setCurrentRoundSuccess(true);
    gameManager.increaseRound();
  } else {
    gameManager.increaseRound();
  }

  gameManager.debugSuccessRound();

  console.log('Succeed count ' + gameManager.succeededCount)
  RefreshRoundCount();
  DisplayRandomShape();

    if(gameManager.currentRound >= gameManager.roundCount){
        setElementActive(gameContainer, false);
        displayResult(gameManager.succeededCount, gameManager.roundCount);
    }
}

function renderRoundBoard() { 
    roundBoard.innerHTML = '<h3>Round Results:</h3>';
    const list = document.createElement('ul');
    gameManager.roundResults.forEach(({ success, shape }, index) => {
        const li = document.createElement('li');
        const img = document.createElement('img');

        const color = success ? 'Green' : 'Red';
        const shapeKey = shape?.name ? `${color}${shape.name.replace('Black', '')}` : null;

        img.src = shapePaths[shapeKey] || '';
        img.alt = `Shape ${index + 1}`;
        img.style.width = '30px';
        img.style.height = '30px';
        img.style.marginLeft = '20px'; // Add spacing between text and image
        img.style.marginBottom = '20px'; // Add spacing between rows
        img.style.verticalAlign = 'middle';

        li.textContent = `Shape ${index + 1}:`;
        li.appendChild(img);
        list.appendChild(li);
    });
    roundBoard.appendChild(list);
}

function setupGameUI() {
  const buttonContainer = document.getElementById('button-container') || createButtonContainer();

  shapeManager.availableShapes.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = s.name;
    btn.id = s.name;
    btn.onclick = () => handleShapeClick(btn.id);
    buttonContainer.appendChild(btn);
  });
}

function DisplayRandomShape() {
    shapeManager.SetNewRandomShape();

    const shapeImg = document.getElementById('shape-image');
    if (shapeImg instanceof HTMLImageElement) {
        shapeImg.src = shapeManager.currentShape.imagePath;
    }
}

function RefreshRoundCount() {
    roundCounter.textContent = `Round ${gameManager.currentRound + 1} of ${gameManager.roundCount}`;
}

function createButtonContainer() {
  const container = document.createElement('div');
  container.id = 'button-container';
  gameContainer.appendChild(container);
  return container;
}

startBtn.onclick = () => {
  RestartGame();
};

playAgainBtn.onclick = () => {
    RestartGame();
}

endCalibrateBtn.onclick = () => {
      setElementActive(gameContainer, false);
      setElementActive(resultContainer, false);
      setCalibrateContainerActive(true);
      setElementActive(startBtn, true);
      startCalibrating();
}

function RestartGame() {
    DisplayRandomShape();
    gameManager.reset();
    RefreshRoundCount();
    setElementActive(resultContainer, false);
    setElementActive(startBtn, false);
    setElementActive(gameContainer, true);

    setCalibrateButtonActive(false);
    setCalibrateContainerActive(false);

    roundBoard.innerHTML = ''; // clear board
}

