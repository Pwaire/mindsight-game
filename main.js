import { Shape } from './shape.js';
import { ShapeManager } from './ShapeManager.js';
import { GameManager } from './GameManager.js';
import { shapePaths } from './AssetsPath.js';
import { getAudioPaths } from './AudioPaths.js';
import { setCalibrateButtonActive } from './CalibrateManager.js';
import { setCalibrateContainerActive } from './CalibrateManager.js';
import { startCalibrating } from './CalibrateManager.js';
import { AudioManager } from './AudioManager.js';
import { SWIPE_THRESHOLD } from './constants.js';
import { LangHelper } from './LangHelper.js';
import { requestFullscreen, exitFullscreen } from './FullScreenHelper.js';


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
const tutorialContainer = document.getElementById('tutorial-container');
const exitFullscreenBtn = document.getElementById('exit-fullscreen-button');
const enterFullscreenBtn = document.getElementById('enter-fullscreen-button');
let newShapeAudio;
let swipeRuleAudio;
let guessSuccessAudio;
let guessErrorAudio;
let explainRulesAudio;
let sessionCompletedAudio;
let isAwaitingShape = false;

let shapeManager; 
let gameManager;

let currentLang;
let langStrings;

(() => {
    currentLang = LangHelper.getLangFromURL();
    langStrings = LangHelper.getStrings(currentLang);
    LangHelper.applyUIText(currentLang);
    const audioPaths = getAudioPaths(currentLang);
    newShapeAudio = AudioManager.register(new Audio(audioPaths.new_shape_displayed));
    swipeRuleAudio = AudioManager.register(new Audio(audioPaths.swipe_rule));
    guessSuccessAudio = AudioManager.register(new Audio(audioPaths.guess_success));
    guessErrorAudio = AudioManager.register(new Audio(audioPaths.guess_error));
    explainRulesAudio = AudioManager.register(new Audio(audioPaths.explain_rules));
    sessionCompletedAudio = AudioManager.register(new Audio(audioPaths.session_completed));

    shapeManager = new ShapeManager('shape-text', 'shape-image', currentLang);
    gameManager = new GameManager();
    setupGameUI();
    setElementActive(gameContainerParent, false);
})();

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function isBrowserFullscreen() {
    return window.innerHeight === screen.height && window.innerWidth === screen.width;
}

function updateFullscreenButtonVisibility() {
    const inDomFullscreen = !!document.fullscreenElement;
    const inBrowserFullscreen = isBrowserFullscreen();
    const showExit = (inDomFullscreen || inBrowserFullscreen) && !isMobile();
    const showEnter = !showExit && !isMobile();
    if (exitFullscreenBtn) {
        exitFullscreenBtn.style.display = showExit ? 'block' : 'none';
    }
    if (enterFullscreenBtn) {
        enterFullscreenBtn.style.display = showEnter ? 'block' : 'none';
    }
}

document.addEventListener('fullscreenchange', updateFullscreenButtonVisibility);
window.addEventListener('resize', updateFullscreenButtonVisibility);

if (exitFullscreenBtn) {
    exitFullscreenBtn.onclick = () => {
        if (document.fullscreenElement) {
            exitFullscreen();
        } else if (isBrowserFullscreen()) {
            alert('Press F11 to exit fullscreen.');
        }
    };
}

if (enterFullscreenBtn) {
    enterFullscreenBtn.onclick = () => {
        requestFullscreen();
    };
}

// Initialize button visibility on load
updateFullscreenButtonVisibility();


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
    AudioManager.play(sessionCompletedAudio);
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
  AudioManager.play(audio);

  if (gameManager.currentRound >= gameManager.roundCount) {
    setTimeout(() => {
      setElementActive(gameContainerParent, false);
      displayResult(gameManager.succeededCount, gameManager.roundCount);
    }, 500);
  } else {
    setTimeout(() => {
        DisplayRandomShape();
      }, 500);
  }
}

function renderRoundBoard() {
    roundBoard.innerHTML = `<h3>${langStrings.round_results}</h3>`;
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
        img.alt = `${langStrings.shape_word} ${index + 1}`;
        img.style.width = '30px';
        img.style.height = '30px';
        img.style.marginLeft = '20px';
        img.style.marginBottom = '20px';
        img.style.verticalAlign = 'middle';

        li.textContent = `${langStrings.shape_word} ${index + 1}:`;
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
    btn.textContent = LangHelper.translateShapeName(s.name, currentLang);
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
    AudioManager.play(swipeRuleAudio);

    setButtonsEnabled(true);
    isAwaitingShape = false;
}

function RefreshRoundCount() {
    roundCounter.textContent = langStrings.round_of(
        gameManager.currentRound + 1,
        gameManager.roundCount
    );
}

function createButtonContainer() {
  const container = document.createElement('div');
  container.id = 'button-container';
  gameContainer.appendChild(container);
  return container;
}

function showTutorial() {
  requestFullscreen();
  setElementActive(resultContainer, false);
  setElementActive(startBtn, false);
  setElementActive(calibrateStartBtn, false);
  setCalibrateContainerActive(false);
  setCalibrateButtonActive(false);
  setElementActive(tutorialContainer, true);
  tutorialContainer.style.display = 'flex';

  AudioManager.play(explainRulesAudio);

  const startGame = (e) => {
    if (e.type === 'keydown' && e.code !== 'Space') return;
    // Prevent the touch event from triggering a subsequent click on
    // the now-visible game UI elements
    if (e.cancelable) {
      e.preventDefault();
    }
    document.removeEventListener('keydown', startGame);
    document.removeEventListener('touchend', startGame);
    setElementActive(tutorialContainer, false);
    RestartGame();
  };

  document.addEventListener('keydown', startGame);
  document.addEventListener('touchend', startGame);
}

startBtn.onclick = () => {
  showTutorial();
};

calibrateStartBtn.onclick = () => {
    showTutorial();
};

playAgainBtn.onclick = () => {
    showTutorial();
}

endCalibrateBtn.onclick = () => {
      setElementActive(gameContainerParent, false);
      setElementActive(resultContainer, false);
      setElementActive(startBtn, true);
      startCalibrating();
}

function RestartGame() {
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

