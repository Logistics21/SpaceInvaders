let spSh = new Image();
let display, input, frames, spFrame, lvFrame;
let invaders, laserBases, Bunkers;
let invaderArr, dir, laserBase, laser, cities;

function init() {
  display = new Display();

  //spriteSheet bound to window (see line 19)
  spSh.onload;
  spSh.src='invader.png';
  // debugger
  invaders = [
    [new Sprite(spSh, 18, 0, 14, 9), new Sprite(spSh, 32, 0, 14, 9)],
    [new Sprite(spSh, 47, 0, 13, 9), new Sprite(spSh, 61, 0, 13, 9)],
    [new Sprite(spSh, 75, 0, 12, 9), new Sprite(spSh, 87, 0, 12, 9)],
    [new Sprite(spSh, 99, 0, 14, 9)]
  ]

  laserBases = [
    new Sprite(spSh, 32, 15, 17, 11),
    new Sprite(spSh, 50, 15, 17, 11),
    new Sprite(spSh, 66, 15, 18, 11),
  ]
  // debugger

  frames = 0;
  spFrame = 0;
  lvFrame = 60;
  // dir = right; better as a number
  dir = 1;

  invaderArr = [];
  let invaderType = [2, 1, 1, 0, 0];
  for (let i = 0; i < invaderType.length; i++) {
    for (let j = 0; j < 11; j++) {
      let inv = invaderType[i];
      invaderArr.push({
        invader: invaders[inv],
        x: 0 + j*45 + [0, 0, 6][inv],
        y: 30 + i*45,
        w: invaders[inv][0].w,
        h: invaders[inv][0].h
      });
    }
  }

  laserBase = {
    laser: laserBases,
    x: (display.width - laserBases[0].w) / 2,
    y: (display.height - (30, + laserBases[0].h)),
    canFire: true
  }

  document.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 37:
        laserBase.x -= 8;
        break;
      case 39:
        laserBase.x += 8;
        break;
      case 65:
        laserBase.x -= 8;
        break;
      case 68:
        laserBase.x += 8;
        break;
      case 32:
        laserBase.canFire = false;
        laser = new Laser(laserBase.x, laserBase.y);
        break;
      default:
        break;
    }
  });
}


function update() {

  laserBase.x = Math.max(Math.min(laserBase.x, display.width - (30 + laserBases[0].w)), 0);

  if (!laserBase.canFire) {
    while (laser.y >= 0) {
      laser.update();
    }
  } else {
    delete laser;
  }

  frames++;
  if (frames % lvFrame === 0) {
    spFrame = (spFrame + 1) % 2;
    let left = 0, right = display.width; //800
    for (let i = 0; i < invaderArr.length; i++) {
      let inv = invaderArr[i];
      inv.x += 30 * dir;
      left = Math.max(left, (inv.x + inv.w));
      right = Math.min(right, inv.x);
      // debugger
    }

    // debugger
    if (left > display.width-15 || right < 0) {
      dir *= -1;
      for (let i = 0; i < invaderArr.length; i++) {
        let inv = invaderArr[i];
        inv.x += 30 * dir;
        inv.y += 30;
      }
    }
  }
};

function render() {
  display.clear();

  for (let i = 0; i < invaderArr.length; i++) {
    let inv = invaderArr[i];
    // sprite frame determines which sprite to animate
    display.createSprite(inv.invader[spFrame], inv.x, inv.y);
  }

  display.ctx.save();

  if (!laserBase.canFire) {
  //   // debugger
  //   while (laser.fired) {
  //     if (laser.y <= 0) {
  //       laser.fired = false;
  //       laserBase.canFire = true;
  //     } else {
        display.fireLaser(laser);
      // }
    // }
  }

  display.ctx.restore();

  display.createSprite(laserBase.laser[0], laserBase.x, laserBase.y-30);
}

function run() {
  var loop = function() {
    update();
    render();

    // var requestAnimationFrame = window.requestAnimationFrame ||
    //                             window.mozRequestAnimationFrame ||
    //                             window.webkitRequestAnimationFrame ||
    //                             window.msRequestAnimationFrame;

    window.requestAnimationFrame(loop, display.canvas);

  };
  window.requestAnimationFrame(loop, display.canvas);
}

class Display {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext('2d');
  }

  createSprite(sp, x, y) {
    this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w*3, sp.h*3);
  }

  fireLaser(laser) {
    this.ctx.fillStyle = laser.color;
    laserBase.canFire = false;
    this.ctx.fillRect(laser.x, laser.y, laser.w, laser.h);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

function Sprite(img, x, y, w, h) {
  // create sprite also bound to window
  this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

function Laser(x, y) {
  this.x = x;
  this.y = y;
  this.vely = -0.01; //laser speed
  this.w = 5;
  this.h = 18;
  this.color = "#fff";
  this.fired = true;
}

Laser.prototype.update = function () {
  this.y += this.vely;
};

document.addEventListener('DOMContentLoaded', ()=> {
  init();
  run();
});
