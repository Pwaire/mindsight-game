import { ShapeManager } from './ShapeManager.js';
import { SWIPE_THRESHOLD } from './constants.js';
import { LangHelper } from './LangHelper.js';
import { AudioManager } from './AudioManager.js';
import { getAudioPaths } from './AudioPaths.js';
import { requestFullscreen } from './FullScreenHelper.js';
const calibrateBtn = document.getElementById('calibrate-button');
const calibrateContainer = document.getElementById('calibrate-container');
const calibrateContainerParent = document.getElementById('calibrate-container-parent');
const nextShapeBtn = document.getElementById('nextShape-calibrate-button');
const shapeNameElement = document.getElementById('calibrateShape-name');
const calibrateStartBtn = document.getElementById('calibrate-start-button');
const startBtnOutside = document.getElementById('start-button');

const currentLang = LangHelper.getLangFromURL();
LangHelper.applyUIText(currentLang);

const shapeImgElement = document.getElementById('calibrateShape-image');

let currentDisplayedShape;

if (!(shapeImgElement instanceof HTMLImageElement)) {
    throw new Error('Expected #calibrateShape-image to be an HTMLImageElement');
}

const shapeImg = shapeImgElement;
const audio = AudioManager.register(new Audio());
let calibrateRulesAudio;

function playShapeAudio(shape) {
    if (!shape || !shape.audioPath) return;
    audio.src = shape.audioPath;
    AudioManager.play(audio);
}

(() => {
    setElementActive(calibrateContainerParent, false);
    setElementActive(nextShapeBtn, false);
    setElementActive(calibrateStartBtn, false);
    const audioPaths = getAudioPaths(currentLang);
    calibrateRulesAudio = AudioManager.register(new Audio(audioPaths.calibrate_rules));
})();

export function setElementActive(container, active) {
    var value = active == true ? 'block' : 'none';
    container.style.display = value;
}

export function setCalibrateButtonActive(active){
    setElementActive(calibrateBtn, active)
}

export function setCalibrateContainerActive(active){
    setElementActive(calibrateContainerParent, active);
}

nextShapeBtn.onclick = () => {
    const manager = new ShapeManager(null, null, currentLang);
    const shapes = manager.availableShapes;

    const currentIndex = shapes.findIndex(shape => shape.name === currentDisplayedShape.name);
    const nextIndex = (currentIndex + 1) % shapes.length;
    currentDisplayedShape = shapes[nextIndex];

    shapeImg.src = currentDisplayedShape.imagePath;
    shapeImg.alt = currentDisplayedShape.name;
    shapeNameElement.textContent = LangHelper.translateShapeName(currentDisplayedShape.name, currentLang); // Show localized name
    playShapeAudio(currentDisplayedShape);
};


calibrateBtn.onclick = startCalibrating;

export function startCalibrating() {
    setCalibrateContainerActive(false);
    showCalibrateTutorial();
}

function beginCalibrationSession() {
    setCalibrateContainerActive(true);
    setElementActive(nextShapeBtn, true);
    setCalibrateButtonActive(false);
    setElementActive(calibrateStartBtn, true);
    setElementActive(startBtnOutside, false);
    SetRandomShape();
}

function showCalibrateTutorial() {
    const tutorialContainer = document.getElementById('tutorial-container');
    if (!tutorialContainer) return;
    requestFullscreen();
    setCalibrateButtonActive(false);
    setElementActive(startBtnOutside, false);
    setElementActive(tutorialContainer, true);
    tutorialContainer.style.display = 'flex';
    AudioManager.play(calibrateRulesAudio);

    const begin = (e) => {
        if (e.type === 'keydown' && e.code !== 'Space') return;
        document.removeEventListener('keydown', begin);
        document.removeEventListener('touchend', begin);
        setElementActive(tutorialContainer, false);
        beginCalibrationSession();
    };

    document.addEventListener('keydown', begin);
    document.addEventListener('touchend', begin);
}

function SetRandomShape() {
    const manager = new ShapeManager(null, null, currentLang);
    currentDisplayedShape = manager.getRandomShape();
    shapeImg.src = currentDisplayedShape.imagePath;
    shapeImg.alt = currentDisplayedShape.name;
    shapeNameElement.textContent = LangHelper.translateShapeName(currentDisplayedShape.name, currentLang); // Show localized name
    playShapeAudio(currentDisplayedShape);
}

// -- Mobile swipe support for calibrate screen --
let calibrateTouchStartX = 0;
let calibrateTouchEndX = 0;

function handleCalibrateSwipeGesture() {
    const diff = calibrateTouchEndX - calibrateTouchStartX;
    if (Math.abs(diff) < SWIPE_THRESHOLD) {
        // Treat as a tap when movement is below the swipe threshold
        nextShapeBtn.click();
        return;
    }
    // For calibration, any horizontal swipe also moves to the next shape
    nextShapeBtn.click();
}

calibrateContainer.addEventListener('touchstart', (e) => {
    calibrateTouchStartX = e.changedTouches[0].screenX;
}, false);

calibrateContainer.addEventListener('touchend', (e) => {
    calibrateTouchEndX = e.changedTouches[0].screenX;
    // Ignore taps on buttons to prevent double actions
    if ((e.target instanceof HTMLElement) && e.target.closest('button')) return;
    handleCalibrateSwipeGesture();
}, false);

// -- Keyboard support --
document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space') return;
    const containerVisible = getComputedStyle(calibrateContainerParent).display !== 'none';
    if (!containerVisible) return;
    nextShapeBtn.click();
});

