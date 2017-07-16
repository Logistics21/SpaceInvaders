import MakeSprite from './makeSprite.js';
import Display from './display.js';
import Input from './input.js';
import Game from './game.js';
import SoundFx from './soundFx';

class Game {
  constructor() {
    this.state = "Home";
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.sound = new SoundFx();
    this.gameOver = false;
    this.score = 0;
    this.lives = 3;
  }

  init() {

  }

  start() {
    // has scope of canvas
    // draw instructions to screen
  }

  reset() {
    this.score = 0;
  }

  toggleMute() {

  }

  gameover() {

  }
}

export default Game;
