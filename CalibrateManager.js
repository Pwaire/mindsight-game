import { ShapeManager } from './ShapeManager.js';
const calibrateBtn = document.getElementById('calibrate-button');
const calibrateContainer = document.getElementById('calibrate-container');
const nextShapeBtn = document.getElementById('nextShape-calibrate-button');
const shapeNameElement = document.getElementById('calibrateShape-name');

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
    setElementActive(calibrateContainer, false);
    setElementActive(nextShapeBtn, false);
})();

export function setElementActive(container, active) {
    var value = active == true ? 'block' : 'none';
    container.style.display = value;
}

export function setCalibrateButtonActive(active){
    setElementActive(calibrateBtn, active)
}

export function setCalibrateContainerActive(active){
    setElementActive(calibrateContainer, active);
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
    setElementActive(calibrateContainer, true);
    setElementActive(nextShapeBtn, true);
    setCalibrateButtonActive(false);
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

