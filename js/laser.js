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

export default Laser;
