export const drawSprite = (ctx, { sprite, x, y }, sp=0) => {
  ctx.drawImage(sprite[sp].img,
    sprite[sp].x, sprite[sp].y, sprite[sp].w, sprite[sp].h,
    x, y, sprite[sp].w*3, sprite[sp].h*3);
}

export const drawLasers = (ctx, arr) => {
  for (let i = 0; i < arr.length; i++) {
    let l = arr[i]
    ctx.fillStyle = l.color;
    ctx.fillRect(l.x, l.y, l.w, l.h);
  }
}

export const updateLasers = (height, arr) => {
  for (let i = 0; i < arr.length; i++) {
    let l = arr[i];
    if (l.y > height) {
      arr.splice(i, 1);
      i--;
      continue;
    } else {
      l.update();
    }
  }
}

export const updateInvaders = (obj, width, lvFrame, spFrame, arr, dir, sound, player) => {
  let left = 0, right = width, len = arr.length;

  for (var i = len-1; i >= 0; i--) {
    let a = arr[i];
    if (obj.collisionAlien(a, player)) {
      sound.fX.die.play();
      player.alive = false;
      player.lives = 0;
    }
  }

  for (let i = 0; i < len; i++) {
    let a = arr[i];
    a.x += 30 * dir;
    left = Math.max(left, a.x + a.w);
    right = Math.min(right, a.x);
  }

  if (left > width - 20 || right < 10) {
    dir *= -1;
    for (let i = 0; i < len; i++) {
      let a = arr[i]
      a.x += 30 * dir;
      a.y += 30;
    }
  }

  if (len > 0) {
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

export const hitInvader = (obj, arr, sound, player, laser, lvFrame, difficulty, mysty) => {
  if (mysty.active && obj.collision(laser, mysty)) {
    mysty.hit = true;
  }

  let len = arr.length;
  for (let i = arr.length-1; i >= 0; i--) {
    let a = arr[i];
    if (obj.collision(laser, a)) {
      a.alive = false;
      len--;
      sound.fX.kill.play();
      player.canFire = true;
    }
  }

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

  return lvFrame;
}

export const clearDead = (arr, score, mysty) => {
  if (mysty.hit) {
    score += mysty.points;
    mysty.active = false;
    mysty.hit = false;
  }

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].alive) {
      score += arr[i].points;
      arr.splice(i, 1);
    }
  }

  return score;
}

export const drawScore = (ctx, score) => {
  ctx.font = "20px Invader";
  ctx.fillStyle = "white";
  ctx.fillText("Score: "+score, 8, 20);
}

export const drawLives = ({ sprite, x, y, lives }, width, ctx) => {
  for (let i = 0; i < lives; i++) {
    width -= (sprite[0].w*3)+10;
    ctx.drawImage(sprite[0].img,
      sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h,
      width, 0, sprite[0].w*3, sprite[0].h*3);
  }
}
