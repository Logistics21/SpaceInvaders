import Laser from './laser.js';
import * as Logic from './logic.js';
import MakeSprite from './makeSprite.js';
import Input from './input.js';

class Display {
  constructor(canvas, ctx, sound, lvl) {
    this.input = new Input();
    this.canvas = canvas;
    this.ctx = ctx;
    this.nxtlvl = false;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.makeSprite = new MakeSprite(this.canvas);
    this.invaderArr = this.makeSprite.makeInvaders(lvl);
    this.mysteryShip = this.makeSprite.makeMysteryShip();
    this.laserArr = [];
    this.laserBase = this.makeSprite.makelaserBase();
    this.frames = 0;
    this.spFrame = 0;
    this.lsFrame = 0;
    this.lvFrame = 60;
    this.dir = 1;
    this.difficulty = 0.015;
    this.sound = sound;
    this.sound.fX.ufo3.volume = 0.20;
    this.sound.fX.ufo2.volume = 0.25;
    this.sound.fX.kill.volume = 0.1;
    this.sound.fX.shoot.volume = 0.15;
    this.sound.fX.fast1.volume = 0.50;
    this.sound.fX.fast2.volume = 0.50;
    this.sound.fX.fast3.volume = 0.50;
    this.sound.fX.fast4.volume = 0.50;
    this.score = 0;
    this.lvl = lvl;
    this.drawPoints = false;
  }

  update() {
    this.frames++;

    document.addEventListener("keydown", (e) => {
      this.input.down[e.keyCode] = true;
    });

    document.addEventListener("keyup", (e) => {
      delete this.input.down[e.keyCode];
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
          this.laser = new Laser(this.laserBase);
          this.laser.fire();
          this.sound.fX.shoot.play();
          this.laserBase.canFire = false;
        }
      }

      if (this.frames % 720 === 0) {
        if (!this.mysteryShip.active) {
        this.deployMystery();
        }
      }

      this.mysteryLeft();
      this.mysteryRight();

      // prevent laserBase from leaving screen
      this.laserBase.x = Math.max(Math.min(this.laserBase.x,
        this.width - (this.laserBase.w * 3)), 0);

      if (this.invaderArr.length > 0) {

        // remove dead invaders
        this.score = Logic.clearDead(this.invaderArr,
                                     this.score, this.mysteryShip);

        //iterate through lasers and update postion
        Logic.updateLasers(this.height, this.laserArr);

        // check to see if player shot exists
        if (!this.laserBase.canFire && this.laser.y > -12) {
          this.laser.update();
        } else {
          this.laserBase.canFire = true;
        }

        // check to see if laser has collided with alien
        if(!this.laserBase.canFire) {
          this.lvFrame = Logic.
            hitInvader(this, this.invaderArr, this.sound,
                       this.laserBase, this.laser,
                       this.lvFrame, this.difficulty, this.mysteryShip);
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
          let alienLaser = new Laser(alien);
          this.laserArr.push(alienLaser);
          alienLaser.fire();
        }

        // move aliens, drop and switch directions at edge of canvas
        if (this.frames % this.lvFrame === 0) {
          this.spFrame = (this.spFrame + 1) % 2;
          this.dir = Logic.updateInvaders(this, this.width, this.lvFrame,
                                          this.spFrame, this.invaderArr,
                                          this.dir, this.sound, this.laserBase)
        }
      } else {
        this.nextLevel();
      }
    }
  };

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.mysteryShip.hit) {
      this.sound.fX.ufo2.play();
      this.drawPoints = true;
      setTimeout(() => {
        this.drawPoints = false;
      }, 1000)
    } else if (this.mysteryShip.active) {
      Logic.drawSprite(this.ctx, this.mysteryShip);
    }

    if (this.drawPoints) {
      this.sound.fX.ufo3.pause();
      this.sound.fX.ufo3.currentTime = 0;
      this.ctx.font = "20px Invader";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(
        "" + this.mysteryShip.points,
           this.mysteryShip.x + (this.mysteryShip.w / 2),
           this.mysteryShip.y + (this.mysteryShip.h*2));
    }


    for (let i = 0; i < this.invaderArr.length; i++) {
      let a = this.invaderArr[i];
      if (a.alive) {
        Logic.drawSprite(this.ctx, a, this.spFrame);
      } else {
        Logic.drawSprite(this.ctx, a, 2);
      }
    }

    this.ctx.save();
    Logic.drawLasers(this.ctx, this.laserArr);

    if (!this.laserBase.canFire) {
      this.ctx.fillStyle = this.laser.color;
      this.ctx.fillRect(this.laser.x, this.laser.y, this.laser.w, this.laser.h);
    }

    this.ctx.restore();

    if (this.laserBase.alive) {
      Logic.drawSprite(this.ctx, this.laserBase, 0);
    } else {
      if (this.frames % this.lvFrame !== 30) {
        this.lsFrame = (this.lsFrame + 2) % 3;
        Logic.drawSprite(this.ctx, this.laserBase, this.lsFrame);
      }
    }

    Logic.drawScore(this.ctx, this.score);
    Logic.drawLives(this.laserBase, this.width, this.ctx);
  };

  run() {
    let loop = () => {
  		this.update();
  		this.render();
      if (this.laserBase.lives === 0) {
        this.gameover();
      } else if (this.lvl > 5) {
        this.victory();
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

  collisionAlien(a, b) {
    if (a.x < (b.x+b.w*3) && b.x < (a.w*3+a.x) &&
        a.y < (b.y+b.h*3) && b.y < (a.h*3+a.y)) {
      return true;
    }
  }

  gameover() {
    window.cancelAnimationFrame(this.frameID);
    this.ctx.clearRect(0, 0, this.width, this.height);
    const vic = Array.from(document.getElementsByClassName('gameover'));
    vic.forEach(el => el.classList.remove('hidden'));
  }

  victory() {
    window.cancelAnimationFrame(this.frameID);
    this.ctx.clearRect(0, 0, this.width, this.height);
    const vic = Array.from(document.getElementsByClassName('victory'));
    vic.forEach(el => el.classList.remove('hidden'));
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

  deployMystery() {
    this.mysteryShip.active = true;
    if (Math.random() < 0.5) {
      this.mysteryShip.dir = -1;
      this.mysteryShip.x = -this.mysteryShip.w;
    } else {
      this.mysteryShip.dir = 1;
      this.mysteryShip.x = this.width+this.mysteryShip.w;
    }
  }

  mysteryLeft() {
    if (this.mysteryShip.active && this.mysteryShip.dir === 1) {
      if ((this.mysteryShip.x + this.mysteryShip.w*3) > 0) {
        this.mysteryShip.x -= 1.75;
        this.sound.fX.ufo3.play();
      } else {
        this.mysteryShip.active = false;
      }
    }
  }

  mysteryRight() {
    if (this.mysteryShip.active && this.mysteryShip.dir === -1) {
      if ((this.mysteryShip.x - this.mysteryShip.w*3) < this.width) {
        this.mysteryShip.x += 1.75;
        this.sound.fX.ufo3.play();
      } else {
        this.mysteryShip.active = false;
      }
    }
  }
}

export default Display;
