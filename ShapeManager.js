import { Shape } from './shape.js';
import { shapePaths } from './AssetsPath.js';
import { getAudioPaths } from './AudioPaths.js';

/**
 * Manager in charge of providing shapes and their associated audio files.
 * The available shapes depend on the language so the audio descriptions can
 * be localised.
 */
export class ShapeManager {
  _currentShape;
  _textElement;
  _imageElement;
  _lang;
  _availableShapes;

  constructor(textId, imageId, lang = 'en') {
    this._textElement = document.getElementById(textId);
    this._imageElement = document.getElementById(imageId);
    this._lang = lang;
    this._availableShapes = this._createShapes();
  }

  _createShapes() {
    const audioPaths = getAudioPaths(this._lang);
    return [
      new Shape('Star', shapePaths.black_star, audioPaths.star),
      new Shape('Square', shapePaths.black_square, audioPaths.square)
    ];
  }

  getRandomShape() {
    return this._availableShapes[Math.floor(Math.random() * this._availableShapes.length)];
  }

  get availableShapes() {
    return this._availableShapes;
  }

  get currentShape(){
    return this._currentShape;
  }

  SetNewRandomShape(){
    this._currentShape = this.getRandomShape();
  }
}
