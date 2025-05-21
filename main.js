import { Shape } from './shape.js';
import { ShapeManager } from './ShapeManager.js';
import { GameManager } from './GameManager.js';
import { shapePaths } from './AssetsPath.js';
import { audioPaths } from './AudioPaths.js';
import { setCalibrateButtonActive } from './CalibrateManager.js';
import { setCalibrateContainerActive } from './CalibrateManager.js';
import { startCalibrating } from './CalibrateManager.js';
import { SWIPE_THRESHOLD } from './constants.js';

const startBtn = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-score');
const playAgainBtn = document.getElementById('playAgain-button');
const endCalibrateBtn = document.getElementById('end-calibrate-button');
const roundCounter = document.getElementById('round-counter');
const roundBoard = document.getElementById('round-board');
const newShapeAudio = new Audio(audioPaths.new_shape_displayed);
const swipeRuleAudio = new Audio(audioPaths.swipe_rule);
const guessSuccessAudio = new Audio(audioPaths.guess_success);
const guessErrorAudio = new Audio(audioPaths.guess_error);
let isFirstShape = true;

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

  const isCorrect = buttonId === shapeManager.currentShape.name;

  if (isCorrect) {
    gameManager.increasePoint();
    gameManager.setCurrentRoundSuccess(true);
  }
  gameManager.increaseRound();

  const audio = isCorrect ? guessSuccessAudio : guessErrorAudio;
  audio.currentTime = 0;
  audio.play();

  console.log('Succeed count ' + gameManager.succeededCount)
  if (gameManager.currentRound >= gameManager.roundCount) {
    setTimeout(() => {
      setElementActive(gameContainer, false);
      displayResult(gameManager.succeededCount, gameManager.roundCount);
    }, 500);
  } else {
    RefreshRoundCount();
    setTimeout(() => {
      DisplayRandomShape();
    }, 500);
  }
}

function renderRoundBoard() { 
    roundBoard.innerHTML = '<h3>Round Results:</h3>';
    const list = document.createElement('ul');
    gameManager.roundResults.forEach(({ success, shape }, index) => {
        const li = document.createElement('li');
        const img = document.createElement('img');

        const rawShapeName = shape?.name?.toLowerCase(); // e.g., 'blackstar'
        let shapeKey = '';

        if (rawShapeName?.includes('star') || rawShapeName?.includes('square')) {
            const base = rawShapeName.includes('star') ? 'star' : 'square';
            const color = success === true ? 'green' : success === false ? 'red' : 'black';
            shapeKey = `${color}_${base}`;
        }

        img.src = shapePaths[shapeKey] || '';
        img.alt = `Shape ${index + 1}`;
        img.style.width = '30px';
        img.style.height = '30px';
        img.style.marginLeft = '20px';
        img.style.marginBottom = '20px';
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
    if (isFirstShape) {
        swipeRuleAudio.currentTime = 0;
        swipeRuleAudio.play();
        isFirstShape = false;
    } else {
        newShapeAudio.currentTime = 0;
        newShapeAudio.play();
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
    isFirstShape = true;
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


// -- Mobile swipe support --
let touchStartX = 0;
let touchEndX = 0;

function handleSwipeGesture() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    if (diff > 0) {
        handleShapeClick('Square');
    } else {
        handleShapeClick('Star');
    }
}

gameContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

gameContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, false);
