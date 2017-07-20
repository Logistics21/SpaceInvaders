import { spSh } from './spritePos.js';

class MakeSprite {
  constructor(canvas) {
    this.canvas = canvas;
    this.image = new Image();
    this.image.src = 'sprites/invader.png';
    this.invSprites = [
      [new Sprite(this.image, spSh[0].x, spSh[0].y, spSh[0].width, spSh[0].height),
       new Sprite(this.image, spSh[1].x, spSh[1].y, spSh[1].width, spSh[1].height),
       new Sprite(this.image, spSh[6].x, spSh[6].y, spSh[6].width, spSh[6].height)],
      [new Sprite(this.image, spSh[2].x, spSh[2].y, spSh[2].width, spSh[2].height),
       new Sprite(this.image, spSh[3].x, spSh[3].y, spSh[3].width, spSh[3].height),
       new Sprite(this.image, spSh[6].x, spSh[6].y, spSh[6].width, spSh[6].height)],
      [new Sprite(this.image, spSh[4].x, spSh[4].y, spSh[4].width, spSh[4].height),
       new Sprite(this.image, spSh[5].x, spSh[5].y, spSh[5].width, spSh[5].height),
       new Sprite(this.image, spSh[6].x, spSh[6].y, spSh[6].width, spSh[6].height)],
      new Sprite(this.image, spSh[10].x, spSh[10].y, spSh[10].width, spSh[10].height)
    ];
    this.laserSprites = [
        new Sprite(this.image, spSh[7].x, spSh[7].y, spSh[7].width, spSh[7].height),
        new Sprite(this.image, spSh[8].x, spSh[8].y, spSh[8].width, spSh[8].height),
        new Sprite(this.image, spSh[9].x, spSh[9].y, spSh[9].width, spSh[9].height)
      ];
  }

  makeInvaders(lvl=1) {
    let invaderArr = [];
    let rows = [2, 1, 1, 0, 0];
  	for (let i = 0, len = rows.length; i < len; i++) {
  		for (let j = 0; j < 10; j++) {
  			let a = rows[i];
  			invaderArr.push({
  				sprite: this.invSprites[a],
  				x: 10 + j*45 + [0, 0, 5][a],
  				y: 70*(lvl) + i*45,
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

  makeMysteryShip() {
    const mysteryShip = {
      sprite: [this.invSprites[3]],
      x: this.canvas.width,
      y: (30 + this.invSprites[3].h),
      w: this.invSprites[3].w,
      h: this.invSprites[3].h,
      active: false,
      hit: false,
      points: 300,
      dir: -1
    }

    return mysteryShip;
  }
}

function Sprite(img, x, y, w, h) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

export default MakeSprite;
