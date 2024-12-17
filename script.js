let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let biquadFilter = audioContext.createBiquadFilter();
biquadFilter.type = "lowpass";
biquadFilter.frequency.value = 7500;

let analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

let audioSource = audioContext.createMediaElementSource(document.getElementById("audio"));
audioSource.connect(analyser);
audioSource.connect(audioContext.destination);

function upload() {
  let input = document.createElement('input');
  input.type = 'file';

  if (navigator.userAgent.toLowerCase().includes('firefox')) {
    input.accept = 'audio/*';
  }

  else {
    input.accept = 'audio/mp3, audio/wav, audio/ogg';
  }

  input.onchange = () => {
    let file = input.files[0];

    let reader = new FileReader();
    reader.onload = function (e) {
      let fileURL = e.target.result;

      document.getElementById("audio").src = fileURL;
      document.getElementById("audio").play();

      document.getElementById("controls").style.opacity = "1";
    }

    reader.readAsDataURL(file);
  }

  input.click();
}

function play() {
  if (document.getElementById("audio").src) {
    if (document.getElementById("audio").paused) {
      document.getElementById("audio").play();
  
      document.getElementById("play-icon").innerText = "pause_circle";
      document.getElementById("play-text").innerText = "Pause";
  
      document.getElementById("play").style.width = "";
    }
  
    else {
      document.getElementById("audio").pause();
  
      document.getElementById("play-icon").innerText = "play_circle";
      document.getElementById("play-text").innerText = "Play";
  
      document.getElementById("play").style.width = "6.75rem";
    }
  }
}

function stop() {
  var volume = 1;

  setInterval(() => {
    document.getElementById("audio").volume = volume;
    volume -= 0.01;
  }, 10);

  if (localStorage.getItem("stop-effect") == "enabled") {
    var speed = 1;

    setInterval(() => {
      document.getElementById("audio").playbackRate = speed;
      speed -= 0.01;
    }, 10);
  }

  setTimeout(() => {
    location.reload();
  }, 1000);
}

const durationInterval = setInterval(() => {
  var duration = document.getElementById("audio").duration;

  if (duration) {
    var currentTime = document.getElementById("audio").currentTime;
        
    var percent = `${(currentTime / duration) * 100}%`;

    document.getElementById("progress-bar").style.width = percent;
  }

  else {
    document.getElementById("progress-bar").style.width = "0%";
  }
});