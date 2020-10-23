const videoContainer = document.getElementById("js-videoPlayer");
const videoPlayer = document.querySelector("#js-videoPlayer video");
const playBtn = document.getElementById("js-playButton");
const volumeBtn = document.getElementById("js-volumeButton");
const fullScreenBtn = document.getElementById("js-fullScreenButton");
const currentTime = document.getElementById("js-currentTime");
const totalTime = document.getElementById("js-totalTime");
const volumeRange = document.getElementById("js-volume");

const registerView = () => {
	const videoId = window.location.href.split("/videos/")[1];
	fetch(`/api/${videoId}/view`, { method: "POST" });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
  } else {
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeRange.value = 0;
  }
}

// ★★★★★ 전체 화면 여부를 알 수 있는 변수가 없어서, addEventListener(), removeEventListener()를 이용해서 구현함
function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  }

  fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';

  fullScreenBtn.removeEventListener("click", goFullScreen);
  fullScreenBtn.addEventListener("click", exitFullScreen);
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }

  fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';

  fullScreenBtn.removeEventListener("click", exitFullScreen);
  fullScreenBtn.addEventListener("click", goFullScreen);
}

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);

  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (seconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }

  return `${hours}:${minutes}:${totalSeconds}`;
};

function setTimes() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

function handleEnded() {
	registerView();

  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
  const {
    target: { value },
  } = event;

  videoPlayer.volume = value;

  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}

function init() {
  videoPlayer.volume = 0.5;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScreenBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("timeupdate", setTimes);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleDrag);
}

if (videoContainer) {
  init();
}
