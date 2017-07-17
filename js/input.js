class Input {
  constructor() {
    this.down = {};
  }

  isDown(code) {
    return this.down[code];
  }
}

export default Input;
