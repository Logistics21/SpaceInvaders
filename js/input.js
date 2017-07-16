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

export default Input;
