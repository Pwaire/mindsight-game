import { Shape } from './shape.js';
import { ShapeManager } from './ShapeManager.js';
import { GameManager } from './GameManager.js';
import { shapePaths } from './AssetsPath.js';
import { getAudioPaths } from './AudioPaths.js';
import { setCalibrateButtonActive } from './CalibrateManager.js';
import { setCalibrateContainerActive } from './CalibrateManager.js';
import { startCalibrating } from './CalibrateManager.js';
import { SWIPE_THRESHOLD } from './constants.js';
import { LangHelper } from './LangHelper.js';


const startBtn = document.getElementById('start-button');
const calibrateStartBtn = document.getElementById('calibrate-start-button');
const gameContainer = document.getElementById('game-container');
const gameContainerParent = document.getElementById('game-container-parent');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-score');
const playAgainBtn = document.getElementById('playAgain-button');
const endCalibrateBtn = document.getElementById('end-calibrate-button');
const roundCounter = document.getElementById('round-counter');
const roundBoard = document.getElementById('round-board');
let newShapeAudio;
let swipeRuleAudio;
let guessSuccessAudio;
let guessErrorAudio;
let isFirstShape = true;
let isAwaitingShape = false;

let shapeManager; 
let gameManager;

let currentLang;

(() => {
    currentLang = LangHelper.getLangFromURL();
    console.log("Lang: " + currentLang);
    const audioPaths = getAudioPaths(currentLang);
    newShapeAudio = new Audio(audioPaths.new_shape_displayed);
    swipeRuleAudio = new Audio(audioPaths.swipe_rule);
    guessSuccessAudio = new Audio(audioPaths.guess_success);
    guessErrorAudio = new Audio(audioPaths.guess_error);

    shapeManager = new ShapeManager('shape-text', 'shape-image', currentLang);
    gameManager = new GameManager();
    setupGameUI();
    setElementActive(gameContainerParent, false);
})();


function setElementActive(container, active) {
    var value = active == true ? 'block' : 'none';
    container.style.display = value;
}

function setButtonsEnabled(enabled) {
    const container = document.getElementById('button-container');
    if (!container) return;
    const buttons = container.getElementsByTagName('button');
    for (let btn of buttons) {
        btn.disabled = !enabled;
    }
}

function displayResult(score, totalRound){
    setElementActive(resultContainer, true);
    resultText.textContent = score + "/" + totalRound;
    renderRoundBoard();
    saveTrainingResult();
}

function handleShapeClick(buttonId) {

  if (isAwaitingShape) return;

  isAwaitingShape = true;
  setButtonsEnabled(false);

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

  if (gameManager.currentRound >= gameManager.roundCount) {
    setTimeout(() => {
      setElementActive(gameContainerParent, false);
      displayResult(gameManager.succeededCount, gameManager.roundCount);
    }, 500);
  } else {
    DisplayRandomShape();
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

function saveTrainingResult() {
    const data = {
        date: new Date().toISOString(),
        score: `${gameManager.succeededCount}/${gameManager.roundCount}`,
        rounds: gameManager.roundResults.map((r, idx) => ({
            s: r.shape.name == 'Star' ? 'S' : 'Q',
            i: r.success ? 1 : 0
        }))
    };

    console.log(data);

    window.parent.postMessage({ type: 'GAME_RESULT', result: data }, '*');
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
    RefreshRoundCount();

    const shapeImg = document.getElementById('shape-image');
    if (shapeImg instanceof HTMLImageElement) {
        shapeImg.src = shapeManager.currentShape.imagePath;
    }
    if (isFirstShape) {
        swipeRuleAudio.currentTime = 0;
        swipeRuleAudio.play();
        isFirstShape = false;
    }

    setButtonsEnabled(true);
    isAwaitingShape = false;
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

calibrateStartBtn.onclick = () => {
    RestartGame();
};

playAgainBtn.onclick = () => {
    RestartGame();
}

endCalibrateBtn.onclick = () => {
      setElementActive(gameContainerParent, false);
      setElementActive(resultContainer, false);
      setCalibrateContainerActive(true);
      setElementActive(startBtn, true);
      startCalibrating();
}

function RestartGame() {
    isFirstShape = true;
    gameManager.reset();
    DisplayRandomShape();
    setElementActive(resultContainer, false);
    setElementActive(startBtn, false);
    setElementActive(calibrateStartBtn, false);
    setElementActive(gameContainerParent, true);

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

document.addEventListener('keydown', (e) => {
    if (isAwaitingShape) return;
    if (e.key === 'ArrowRight') {
        handleShapeClick('Square');
    } else if (e.key === 'ArrowLeft') {
        handleShapeClick('Star');
    }
});

gameContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

gameContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, false);

// -- Mobile tap left/right support --
gameContainer.addEventListener('touchend', (e) => {
    // Use existing swipe if swipe distance is sufficient
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) >= SWIPE_THRESHOLD) {
        handleSwipeGesture();
        return;
    }

    // If it's just a tap, determine which side of the screen was touched
    const screenWidth = window.innerWidth;
    const touchX = e.changedTouches[0].clientX;

    if (isAwaitingShape) return;

    if (touchX < screenWidth / 2) {
        handleShapeClick('Star'); // left side = Star
    } else {
        handleShapeClick('Square'); // right side = Square
    }
});

