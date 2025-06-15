import { ShapeManager } from './ShapeManager.js';
import { SWIPE_THRESHOLD } from './constants.js';
const calibrateBtn = document.getElementById('calibrate-button');
const calibrateContainer = document.getElementById('calibrate-container');
const calibrateContainerParent = document.getElementById('calibrate-container-parent');
const nextShapeBtn = document.getElementById('nextShape-calibrate-button');
const shapeNameElement = document.getElementById('calibrateShape-name');
const calibrateStartBtn = document.getElementById('calibrate-start-button');
const startBtnOutside = document.getElementById('start-button');

const shapeImgElement = document.getElementById('calibrateShape-image');

let currentDisplayedShape;

if (!(shapeImgElement instanceof HTMLImageElement)) {
    throw new Error('Expected #calibrateShape-image to be an HTMLImageElement');
}

const shapeImg = shapeImgElement;
const audio = new Audio();

function playShapeAudio(shape) {
    if (!shape || !shape.audioPath) return;
    audio.src = shape.audioPath;
    audio.play();
}

(() => {
    setElementActive(calibrateContainerParent, false);
    setElementActive(nextShapeBtn, false);
    setElementActive(calibrateStartBtn, false);
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
    const manager = new ShapeManager(null, null);
    const shapes = manager.availableShapes;

    const currentIndex = shapes.findIndex(shape => shape.name === currentDisplayedShape.name);
    const nextIndex = (currentIndex + 1) % shapes.length;
    currentDisplayedShape = shapes[nextIndex];

    shapeImg.src = currentDisplayedShape.imagePath;
    shapeImg.alt = currentDisplayedShape.name;
    shapeNameElement.textContent = currentDisplayedShape.name; // Show name
    playShapeAudio(currentDisplayedShape);
};


calibrateBtn.onclick = startCalibrating;

export function startCalibrating() {
    setElementActive(calibrateContainerParent, true);
    setElementActive(nextShapeBtn, true);
    setCalibrateButtonActive(false);
    setElementActive(calibrateStartBtn, true);
    setElementActive(startBtnOutside, false);
    SetRandomShape();
}

function SetRandomShape() {
    const manager = new ShapeManager(null, null);
    currentDisplayedShape = manager.getRandomShape();
    shapeImg.src = currentDisplayedShape.imagePath;
    shapeImg.alt = currentDisplayedShape.name;
    shapeNameElement.textContent = currentDisplayedShape.name; // Show name
    playShapeAudio(currentDisplayedShape);
}

// -- Mobile swipe support for calibrate screen --
let calibrateTouchStartX = 0;
let calibrateTouchEndX = 0;

function handleCalibrateSwipeGesture() {
    const diff = calibrateTouchEndX - calibrateTouchStartX;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    // For calibration, any horizontal swipe moves to the next shape
    nextShapeBtn.click();
}

calibrateContainer.addEventListener('touchstart', (e) => {
    calibrateTouchStartX = e.changedTouches[0].screenX;
}, false);

calibrateContainer.addEventListener('touchend', (e) => {
    calibrateTouchEndX = e.changedTouches[0].screenX;
    handleCalibrateSwipeGesture();
}, false);

