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


export default SoundFx;