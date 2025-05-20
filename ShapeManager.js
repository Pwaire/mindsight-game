import { Shape } from './shape.js';
import { shapePaths } from './AssetsPath.js';

export const availableShapes = [
  new Shape('Star', shapePaths.black_star),
  new Shape('Square', shapePaths.black_square)
];

export class ShapeManager {

_currentShape;
_textElement;
_imageElement;

  constructor(textId, imageId) {
    this._textElement = document.getElementById(textId);
    this._imageElement = document.getElementById(imageId);
  }

  getRandomShape() {
    return availableShapes[Math.floor(Math.random() * availableShapes.length)];
  }

  get availableShapes() {
    return availableShapes;
  }

  get currentShape(){
    return this._currentShape;
  }

  SetNewRandomShape(){
    this._currentShape = this.getRandomShape();
  }
}
