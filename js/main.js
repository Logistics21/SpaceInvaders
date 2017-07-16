import Display from './display.js';
import Game from './game.js';
import SoundFx from './soundFx';


function play() {
  const modal = document.getElementsByClassName('modal');
  Array.prototype.forEach.call(modal, el => el.classList.add('hidden'));

  // const game = new Game();
  const sound = new SoundFx();

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
  const display = new Display(canvas, ctx, sound, lvl);
  display.run();
}

document.addEventListener('DOMContentLoaded', (e) => {
  document.addEventListener('click', play)
});
