/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__laser_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logic_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__makeSprite_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__input_js__ = __webpack_require__(2);





class Display {
  constructor(canvas, ctx, sound, lvl) {
    this.input = new __WEBPACK_IMPORTED_MODULE_3__input_js__["a" /* default */]();
    this.canvas = canvas;
    this.ctx = ctx;
    this.nxtlvl = false;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.makeSprite = new __WEBPACK_IMPORTED_MODULE_2__makeSprite_js__["a" /* default */](this.canvas);
    this.invaderArr = this.makeSprite.makeInvaders(lvl);
    this.laserArr = [];
    this.laserBase = this.makeSprite.makelaserBase();
    this.frames = 0;
    this.spFrame = 0;
    this.lsFrame = 0;
    this.lvFrame = 60;
    this.dir = 1;
    this.difficulty = 0.015;
    this.sound = sound;
    this.score = 0;
    this.lvl = lvl;
  }

  update() {
    this.frames++;

    document.addEventListener("keydown", (e) => {
      this.input.down[e.keyCode] = true;
    });

    document.addEventListener("keyup", (e) => {
      delete this.input.down[e.keyCode];
      delete this.input.pressed[e.keyCode];
    });

    if (this.laserBase.alive) {
      if (this.input.isDown(37) || this.input.isDown(65)) {
        this.laserBase.x -= 4;
      }

      if (this.input.isDown(39) || this.input.isDown(68)) {
        this.laserBase.x += 4;
      }

      if (this.input.isDown(32)) {
        if (this.laserBase.canFire) {
          this.laser = new __WEBPACK_IMPORTED_MODULE_0__laser_js__["a" /* default */](this.laserBase);
          this.laser.fire();
          this.sound.fX.shoot.play();
          this.laserBase.canFire = false;
        }
      }

      // prevent laserBase from leaving screen
      this.laserBase.x = Math.max(Math.min(this.laserBase.x,
        this.width - (this.laserBase.w * 3)), 0);

      if (this.invaderArr.length > 0) {
        // remove dead invaders
        this.score = __WEBPACK_IMPORTED_MODULE_1__logic_js__["a" /* clearDead */](this.invaderArr, this.score);

        //iterate through lasers and update postion
        __WEBPACK_IMPORTED_MODULE_1__logic_js__["h" /* updateLasers */](this.width, this.laserArr);

        // check to see if player shot exists
        if (!this.laserBase.canFire && this.laser.y > -12) {
          this.laser.update();
        } else {
          this.laserBase.canFire = true;
        }

        // check to see if laser has collided with alien
        if(!this.laserBase.canFire) {
          this.lvFrame = __WEBPACK_IMPORTED_MODULE_1__logic_js__["f" /* hitInvader */](this, this.invaderArr, this.sound,
                       this.laserBase, this.laser,
                       this.lvFrame, this.difficulty);
        }

        // check to see if alien laser hit player
        for (let i = 0; i < this.laserArr.length; i++) {
          let l = this.laserArr[i];

          if (this.collision(l, this.laserBase)) {
            this.playerDie();
          };
        }

        function gra(min, max) {
          return Math.random() * (max - min) + min;
        }

        if (Math.random() < this.difficulty) {
          let alien = this.invaderArr[Math.floor(gra(0, this.invaderArr.length))];
          let alienLaser = new __WEBPACK_IMPORTED_MODULE_0__laser_js__["a" /* default */](alien);
          this.laserArr.push(alienLaser);
          alienLaser.fire();
        }

        // move aliens, drop and switch directions at edge of canvas
        if (this.frames % this.lvFrame === 0) {
          this.spFrame = (this.spFrame + 1) % 2;
          this.dir = __WEBPACK_IMPORTED_MODULE_1__logic_js__["g" /* updateInvaders */](this.width, this.lvFrame,
                                          this.spFrame, this.invaderArr,
                                          this.dir, this.sound)
        }
      } else {
        this.nextLevel();
      }
    }
  };

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.invaderArr.length; i++) {
      let a = this.invaderArr[i];
      if (a.alive) {
        __WEBPACK_IMPORTED_MODULE_1__logic_js__["e" /* drawSprite */](this.ctx, a, this.spFrame);
      } else {
        __WEBPACK_IMPORTED_MODULE_1__logic_js__["e" /* drawSprite */](this.ctx, a, 2);
      }
    }

    this.ctx.save();
    __WEBPACK_IMPORTED_MODULE_1__logic_js__["b" /* drawLasers */](this.ctx, this.laserArr);

    if (!this.laserBase.canFire) {
      this.ctx.fillStyle = this.laser.color;
      this.ctx.fillRect(this.laser.x, this.laser.y, this.laser.w, this.laser.h);
    }

    this.ctx.restore();

    if (this.laserBase.alive) {
      __WEBPACK_IMPORTED_MODULE_1__logic_js__["e" /* drawSprite */](this.ctx, this.laserBase, 0);
    } else {
      if (this.frames % this.lvFrame !== 30) {
        this.lsFrame = (this.lsFrame + 2) % 3;
        __WEBPACK_IMPORTED_MODULE_1__logic_js__["e" /* drawSprite */](this.ctx, this.laserBase, this.lsFrame);
      }
    }

    __WEBPACK_IMPORTED_MODULE_1__logic_js__["d" /* drawScore */](this.ctx, this.score);
    __WEBPACK_IMPORTED_MODULE_1__logic_js__["c" /* drawLives */](this.laserBase, this.width, this.ctx);
  };

  run() {
    let loop = () => {
  		this.update();
  		this.render();
      if (this.lvl > 5) {
        this.victory();
      } else if (this.laserBase.lives === 0) {
        this.gameover(loop);
      } else {
        this.frameID = window.requestAnimationFrame(loop);
      }
  	};

  	window.requestAnimationFrame(loop, this.canvas);
  };

  collision(a, b) {
    if (a.x < (b.x+b.w*3) && b.x < (a.w+a.x) &&
        a.y < (b.y+b.h*3) && b.y < (a.h+a.y)) {
      return true;
    }
  }

  gameover(loop) {
    this.frameID = window.requestAnimationFrame(loop);
    setTimeout(() => {
      window.cancelAnimationFrame(this.frameID);
      this.ctx.clearRect(0, 0, this.width, this.height);
      const go = document.getElementsByClassName('gameover');
      Array.prototype.forEach.call(go, el => el.classList.remove('hidden'));
    }, 1000);
  }

  victory() {
    window.cancelAnimationFrame(this.frameID);
    this.ctx.clearRect(0, 0, this.width, this.height);
    const vic = document.getElementsByClassName('victory');
    Array.prototype.forEach.call(vic, el => el.classList.remove('hidden'));
  }

  playerDie() {
    this.sound.fX.die.play();
    this.laserBase.alive = false;
    this.laserArr = [];
    this.laserBase.lives--;
    setTimeout(() => {
      this.laserBase.alive = true;
    }, 1500);
  }

  nextLevel() {
    this.lvl++;
    this.laserArr = [];
    this.laser.destroy;
    this.laserBase.lives += 1;
    this.frames = 0;
    this.dir = 1;
    this.lvFrame = 60;
    this.invaderArr = this.makeSprite.makeInvaders(this.lvl);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Display);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__spritePos_js__ = __webpack_require__(8);


class MakeSprite {
  constructor(canvas) {
    this.canvas = canvas;
    this.image = new Image();
    this.image.src = 'sprites/invader.png';
    this.invSprites = [
      [new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][0].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][0].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][0].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][0].height),
       new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][1].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][1].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][1].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][1].height),
       new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].height)],
      [new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][2].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][2].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][2].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][2].height),
       new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][3].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][3].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][3].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][3].height),
       new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].height)],
      [new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][4].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][4].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][4].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][4].height),
       new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][5].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][5].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][5].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][5].height),
       new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][6].height)],
    ];
    this.laserSprites = [
        new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][7].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][7].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][7].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][7].height),
        new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][8].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][8].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][8].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][8].height),
        new Sprite(this.image, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][9].x, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][9].y, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][9].width, __WEBPACK_IMPORTED_MODULE_0__spritePos_js__["a" /* spSh */][9].height)
      ];
  }

  makeInvaders(lvl=1) {
    let invaderArr = [];
    let rows = [2, 1, 1, 0, 0];
  	for (let i = 0, len = rows.length; i < len; i++) {
  		for (let j = 0; j < 1; j++) {
  			let a = rows[i];
  			invaderArr.push({
  				sprite: this.invSprites[a],
  				x: 10 + j*45 + [0, 0, 5][a],
  				y: 35*(lvl) + i*45,
  				w: this.invSprites[a][0].w,
  				h: this.invSprites[a][0].h,
          alive: true,
          type: "alien",
          points: 10 + (10*a)
  			});
  		}
  	}

    return invaderArr;
  }

  makelaserBase() {
    const laserBase = {
      sprite: this.laserSprites,
      x: (this.canvas.width - this.laserSprites[0].w) / 2,
      y: (this.canvas.height - (30 + this.laserSprites[0].h)),
      w: this.laserSprites[0].w,
      h: this.laserSprites[0].h,
      canFire: true,
      alive: true,
      type: "player",
      lives: 3
    }

    return laserBase;
  }
}

function Sprite(img, x, y, w, h) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

/* harmony default export */ __webpack_exports__["a"] = (MakeSprite);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Input {
  constructor() {
    this.down = {};
    this.pressed = {};
  }

  isDown(code) {
    return this.down[code];
  }

  isPressed(code) {
    if (this.pressed[code]) {
      return false;
    } else if (this.down[code]) {
      return this.pressed[code] = true;
    }
    return false;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Input);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__makeSprite_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__display_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__input_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__game_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__soundFx__ = __webpack_require__(4);






class Game {
  constructor() {
    this.state = "Home";
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.sound = new __WEBPACK_IMPORTED_MODULE_4__soundFx__["a" /* default */]();
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

/* unused harmony default export */ var _unused_webpack_default_export = (Game);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class SoundFx {
  constructor() {
    this.fX = {
      fast1: new Audio("sounds/fast1.wav"),
      fast2: new Audio("sounds/fast2.wav"),
      fast3: new Audio("sounds/fast3.wav"),
      fast4: new Audio("sounds/fast4.wav"),
      die: new Audio("sounds/die.wav"),
      shoot: new Audio("sounds/shoot.wav"),
      kill: new Audio("sounds/killinv.wav")
    }

    this.muted = true;
  }

  mute() {
    for (const key of Object.keys(this.fX)) {
      this.fX[key].muted = true;
    }

    this.muted = true;
  }

  unmute() {
    for (const key of Object.keys(this.fX)) {
      this.fX[key].muted = false;
    }

    this.muted = false;
  }
}


/* harmony default export */ __webpack_exports__["a"] = (SoundFx);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__display_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__soundFx__ = __webpack_require__(4);





function play() {
  const modal = document.getElementsByClassName('modal');
  Array.prototype.forEach.call(modal, el => el.classList.add('hidden'));

  // const game = new Game();
  const sound = new __WEBPACK_IMPORTED_MODULE_2__soundFx__["a" /* default */]();

  document.getElementById("mute").addEventListener("click", function(e) {
    if (sound.muted === true) {
      sound.unmute();
      e.target.innerHTML = 'Mute';
    } else {
      sound.mute();
      e.target.innerHTML = 'Unmute';
    }
  });

  main(sound);
}

function main(sound) {
  document.removeEventListener('click', play);
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext('2d');
  let lvl = 1;
  const display = new __WEBPACK_IMPORTED_MODULE_0__display_js__["a" /* default */](canvas, ctx, sound, lvl);
  display.run();
}

document.addEventListener('DOMContentLoaded', (e) => {
  document.addEventListener('click', play)
});


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Laser {
  constructor(shooter) {
    this.x = shooter.x + (shooter.sprite[0].w*1.5);
    this.y = shooter.y;
    this.color = "#fff";
    this.w = 3;
    this.h = 12;
    this.active = false;
    this.origin = shooter.type;
  }

  fire() {
    if (!this.active) this.active = true;
  }

  update() {
    this.origin === "player" ? this.y += -8 : this.y += 6
  }

  destroy() {
    if (this.active) {
      this.y = -12;
      this.active = false;
    }
  }

  draw() {

  }
}

/* harmony default export */ __webpack_exports__["a"] = (Laser);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const drawSprite = (ctx, { sprite, x, y }, sp) => {
  ctx.drawImage(sprite[sp].img,
    sprite[sp].x, sprite[sp].y, sprite[sp].w, sprite[sp].h,
    x, y, sprite[sp].w*3, sprite[sp].h*3);
}
/* harmony export (immutable) */ __webpack_exports__["e"] = drawSprite;


const drawLasers = (ctx, arr) => {
  for (let i = 0; i < arr.length; i++) {
    let l = arr[i]
    ctx.fillStyle = l.color;
    ctx.fillRect(l.x, l.y, l.w, l.h);
  }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = drawLasers;


const updateLasers = (width, arr) => {
  for (let i = 0; i < arr.length; i++) {
    let l = arr[i];
    if (l.y > width) {
      arr.splice(i, 1);
      i--;
      continue;
    } else {
      l.update();
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["h"] = updateLasers;


const updateInvaders = (width, lvFrame, spFrame, arr, dir, sound) => {
  let left = 0, right = width;
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i];
    a.x += 30 * dir;
    left = Math.max(left, a.x + a.w);
    right = Math.min(right, a.x);
  }
  if (left > width - 20 || right < 10) {
    dir *= -1;
    for (let i = 0; i < arr.length; i++) {
      let a = arr[i]
      a.x += 30 * dir;
      a.y += 30;
    }
  }
  if (arr.length > 0) {
    if (spFrame === 0 && lvFrame < 20) {
      sound.fX.fast2.play();
    } else if (spFrame === 1 && lvFrame < 20) {
      sound.fX.fast3.play();
    } else if (spFrame === 0 && lvFrame < 30) {
      sound.fX.fast2.play();
    } else if (spFrame === 1 && lvFrame < 30) {
      sound.fX.fast4.play();
    } else if (spFrame === 0 && lvFrame < 70) {
      sound.fX.fast1.play();
    } else if (spFrame === 1 && lvFrame < 70) {
      sound.fX.fast4.play();
    }
  }

  return dir;
}
/* harmony export (immutable) */ __webpack_exports__["g"] = updateInvaders;


const hitInvader = (obj, arr, sound, player, laser, lvFrame, difficulty) => {
  let len = arr.length;
  for (let i = arr.length-1; i >= 0; i--) {
    let a = arr[i];
    if (obj.collision(laser, a)) {
      // laser.destroy();
      a.alive = false;
      len--;
      sound.fX.kill.play();
      player.canFire = true;

      switch (len) {
        case 40:
          lvFrame = 50;
          break;
        case 30:
          lvFrame = 40;
          break;
        case 20:
          difficulty = 0.03;
          lvFrame = 30;
          break;
        case 10:
          lvFrame = 25;
          break;
        case 1:
          lvFrame = 6;
          break;
      }

      break;
    }
  }

  return lvFrame;
}
/* harmony export (immutable) */ __webpack_exports__["f"] = hitInvader;


const clearDead = (arr, score, lvl) => {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].alive) {
      score += arr[i].points;
      arr.splice(i, 1);
    }
  }

  return score;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = clearDead;


const drawScore = (ctx, score) => {
  ctx.font = "20px Invader";
  ctx.fillStyle = "white";
  ctx.fillText("Score: "+score, 8, 20);
}
/* harmony export (immutable) */ __webpack_exports__["d"] = drawScore;


const drawLives = ({ sprite, x, y, lives }, width, ctx) => {
  for (let i = 0; i < lives; i++) {
    width -= (sprite[0].w*3)+10;
    ctx.drawImage(sprite[0].img,
      sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h,
      width, 0, sprite[0].w*3, sprite[0].h*3);
  }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = drawLives;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const spSh = [
  { x: 18,
    y: 0,
    width: 14,
    height: 9
  },
  {
    x: 32,
    y: 0,
    width: 14,
    height: 9
  },
  {
    x: 47,
    y: 0,
    width: 13,
    height: 9
  },
  {
    x: 61,
    y: 0,
    width: 13,
    height: 9
  },
  {
    x: 75,
    y: 0,
    width: 12,
    height: 9
  },
  {
    x: 87,
    y: 0,
    width: 12,
    height: 9
  },
  {
    x: 99,
    y: 0,
    width: 14,
    height: 9
  },
  {
    x: 32,
    y: 15,
    width: 17,
    height: 11
  },
  {
    x: 50,
    y: 15,
    width: 17,
    height: 11
  },
  {
    x: 66,
    y: 15,
    width: 18,
    height: 11
  }
];
/* harmony export (immutable) */ __webpack_exports__["a"] = spSh;



/***/ })
/******/ ]);
//# sourceMappingURL=game.js.map