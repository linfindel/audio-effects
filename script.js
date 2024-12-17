let audioContext, biquadFilter, audioSource;

function upload() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  biquadFilter = audioContext.createBiquadFilter();
  biquadFilter.type = "lowshelf";
  biquadFilter.frequency.value = 1000;
  biquadFilter.gain.value = 25;
  document.getElementById("audio").preservesPitch = false;;

  audioSource = audioContext.createMediaElementSource(document.getElementById("audio"));
  audioSource.connect(audioContext.destination);

  audioSource.connect(biquadFilter);
  biquadFilter.connect(audioContext.destination);


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
      document.getElementById("controls").style.pointerEvents = "all";
    }

    reader.readAsDataURL(file);
  }

  input.click();
}

function updateFilterValues() {
  biquadFilter.frequency.value = document.getElementById("freq").value;
  biquadFilter.detune.value = document.getElementById("detune").value;
  biquadFilter.Q.value = document.getElementById("q").value;
  biquadFilter.gain.value = document.getElementById("gain").value;
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
  location.reload();
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

setInterval(() => {
  try {
    if (document.getElementById("audio").paused) {
      document.getElementById("play-icon").innerText = "play_circle";
      document.getElementById("play-text").innerText = "Play";

      document.getElementById("play").style.width = "6.75rem";
    }

    else {
      document.getElementById("play-icon").innerText = "pause_circle";
      document.getElementById("play-text").innerText = "Pause";

      document.getElementById("play").style.width = "";
    }
  }

  catch {
    // Audio playback has not started
  }
}, 100);

const progressContainer = document.getElementById("progress-container");
const tooltip = document.getElementById("tooltip");

progressContainer.addEventListener("mousemove", showTooltip);
progressContainer.addEventListener("mouseout", hideTooltip);

function showTooltip(event) {
  const duration = document.getElementById("audio").duration;
  const offsetX = event.clientX - progressContainer.getBoundingClientRect().left;
  const percentage = (offsetX / progressContainer.offsetWidth) * 100;
  const currentTime = (percentage / 100) * duration;

  const formattedTime = formatTime(currentTime);

  tooltip.style.opacity = "1";
  tooltip.style.top = `${progressContainer.offsetTop - 16}px`;
  tooltip.style.left = `${event.pageX - progressContainer.getBoundingClientRect().left}px`;
  tooltip.textContent = formattedTime;
}

function hideTooltip() {
  tooltip.style.opacity = "0";
}

function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const formattedHours = hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
  const formattedMinutes = `${minutes.toString().padStart(2, "0")}:`;
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return hours > 0 ? `${formattedHours}${formattedMinutes}${formattedSeconds}` : `${formattedMinutes}${formattedSeconds}`;
}

function updateProgressClick(event) {
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.getElementById("progress-container");
  const offsetX = event.clientX - progressContainer.getBoundingClientRect().left;
  const percentage = (offsetX / progressContainer.offsetWidth) * 100;

  progressBar.style.width = `${percentage}%`;
  const newTime = (percentage / 100) * document.getElementById("audio").duration;
  document.getElementById("audio").currentTime = newTime;
}

document.getElementById("progress-container").addEventListener("click", updateProgressClick);

