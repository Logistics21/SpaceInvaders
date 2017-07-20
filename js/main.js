import Display from './display.js';
import Game from './game.js';
import SoundFx from './soundFx';


document.addEventListener('DOMContentLoaded', (e) => {
  // var config = {
  //   apiKey: "AIzaSyAcDMh-Q_J-6QwCmxsYm7gbmk7ZFxixUNI",
  //   authDomain: "space-invaders-56898.firebaseapp.com",
  //   databaseURL: "https://space-invaders-56898.firebaseio.com",
  //   projectId: "space-invaders-56898",
  //   storageBucket: "space-invaders-56898.appspot.com",
  //   messagingSenderId: "637696355165"
  // };
  //
  // firebase.initializeApp(config);
  const button = Array.from(document.getElementsByClassName("button"));

  button.forEach(el => {
    el.addEventListener("click", (e) => {
      const go = Array.from(document.getElementsByClassName('gameover'));
      go.forEach(el => el.classList.add('hidden'));
      const vic = Array.from(document.getElementsByClassName('victory'));
      vic.forEach(el => el.classList.add('hidden'));
      play();
    });
  });

  document.addEventListener('click', play)
});

function play() {
  const modal = Array.from(document.getElementsByClassName('modal'));
  modal.forEach(el => { el.classList.add('hidden') });

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
  // let scores = firebase.database().ref("scores");
  const display = new Display(canvas, ctx, sound, lvl);
  display.run();
}
