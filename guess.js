// target 위치들
var targetTitle = document.getElementById("Title");
var targetArtist = document.getElementById("Artist");
var targetAnswer = document.getElementById("answerZone");
var targetAnswerBtn = document.getElementById("answerBtn");
var targetPlayBtn = document.getElementById("playBtn");
var targetVideo = document.getElementById("videoZone");
var targetAlbumArt = document.getElementById("albumArt");
var targetSettings = document.getElementById("settings");
var targetSettingBtn = document.getElementById("settingBtn");
var targetSeconds = document.getElementById("seconds");
var targetProfile = document.getElementById("profile");
var targetTheme = document.getElementById("theme");
var targetChooseTheme = document.getElementById("chooseTheme");
targetAnswer.style.visibility = "hidden";
targetAnswerBtn.style.visibility = "hidden";
targetAlbumArt.style.visibility = "hidden";
targetSettingBtn.style.visibility = "visible";
targetSettings.style.visibility = "hidden";
targetChooseTheme.src = "guessSrc/chooseTheme.png";
targetChooseTheme.style.visibility = "hidden";
targetTheme.style.visibility = "hidden";

var audio = new Audio('clickEffect.m4a');
var seconds = 3;

//비동기방식으로 아이프레임 플레이어 API 코드를 불러옵니다. 
var tag = document.createElement('script'); 
tag.src = "https://www.youtube.com/player_api"; 
var firstScriptTag = document.getElementsByTagName('script')[0]; 
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 노래관련 변수들
var id = "gE9vcSbENwo"; // 인트로 영상 주소임
var title = "junsik forever";
var numOfSongs = 0;
var dupChecker = new Array(100);
var songCnt = 0;
for (var i = 1; i < 100; i++) {
  dupChecker[i] = 0;
}
function getMusicInfo() {
  fetch("http://junsik-universe.com/" + themes[theme]+ ".json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    numOfSongs = json.numOfSongs - 1;
    if (songCnt == numOfSongs) {
      for (var i = 1; i < 100; i++) {
        dupChecker[i] = 0;
      }
      songCnt = 0;
    }
    let random = -1;
    while (random == -1) {
      random = Math.floor((Math.random() * (numOfSongs - 0) + 0));
      if (dupChecker[random] == 0) {
        dupChecker[random] = 1;
        id = json.music[random].id;
        title = json.music[random].Title;
        artist = json.music[random].Artist;
        songCnt++;
      } else {
        random = -1;
      }
    }
  }); 
}


// theme 관련
var themes = [];
var theme = 0;
themes[0] = "guessSrc/IU";
themes[1] = "guessSrc/2022";
const numOfThemes = 2;

targetProfile.src = themes[0]  + ".png";

function next() {
  audio.play();
  if(theme == numOfThemes - 1) {
    theme = 0;
  } else {
    theme++;
  }
  targetProfile.src = themes[theme] + ".png";
  //targetChooseTheme.src = themes[theme] + "btn.png";
  getMusicInfo();
  changeVideo(id);
  playVideo();
}

function prev() {
  audio.play();
  if(theme == 0) {
    theme = numOfThemes - 1;
  } else {
    theme--;
  }
  targetProfile.src = themes[theme] + ".png";
  //targetChooseTheme.src = themes[theme] + "btn.png";
  getMusicInfo();
  changeVideo(id);
  playVideo();
}

var themeCnt = 0;
function chooseTheme() {
  audio.play();
  if (themeCnt == 0) {
    targetTheme.style.visibility = "visible";
    targetChooseTheme.src = "guessSrc/selectBtn.png";

    themeCnt = 1;
  } else {
    targetTheme.style.visibility = "hidden";
    targetChooseTheme.src = themes[theme] + "btn.png";
    songCnt = 0;
    for (var i = 1; i < 100; i++) {
      dupChecker[i] = 0;
    }

    themeCnt = 0;
  }
}

// 정답보기 버튼 누른후 실행 하는거
function showAnswer() {
    audio.play();
    targetSettings.style.visibility = "hidden";
    setBtnCnt = 0;
    targetAnswerBtn.style.visibility = "hidden";
    targetArtist.innerText = artist;
    targetTitle.innerText = title;
    targetAlbumArt.src = "https://img.youtube.com/vi/" + id + "/hqdefault.jpg";
    setTimeout(function() {
      targetAnswer.style.visibility = "visible";
      targetAlbumArt.style.visibility = "visible";
      getMusicInfo();
    }, 500);
  count = 0;
}

var count = 0;
var connect = 0; //첫번째 접속인지 확인
// Play 버튼 눌렀을때
function playMusic() {
  audio.play();
  targetSettings.style.visibility = "hidden";
  setBtnCnt = 0;
  done = false;
  if (connect == 0) {
    targetPlayBtn.style.visibility = "hidden";
    playIntro();
    getMusicInfo();
  } else {
    if (count == 0) {
        targetAlbumArt.style.visibility = "hidden";
        targetAnswer.style.visibility = "hidden";
        changeVideo(id);
    }
    musicOn();
  }
  connect++;
}

var setBtnCnt = 0;
function showSetting() {
  audio.play();
  if (setBtnCnt == 0) {
    targetSettings.style.visibility = "visible";
    setBtnCnt = 1;
  } else {
    targetSettings.style.visibility = "hidden";
    setBtnCnt = 0;
  }
  
}

function musicOn() {
  targetPlayBtn.style.visibility = "hidden";
  targetAnswerBtn.style.visibility = "hidden";
  playVideo();
  count++;
}

function playIntro() {
  player.playVideo();
}

var slider = document.getElementById("myRange");
slider.value = seconds;
targetSeconds.innerText = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  audio.play();
  targetSeconds.innerText = this.value;
  seconds = this.value;
}

// youtube api가 불러와지면 바로 실행되는 거임 (유튜브 제공) 
// 아래부터는 다 유튜브 관련 함수들임
var player; 
function onYouTubePlayerAPIReady() { 
  player = new YT.Player('player', {
    //height: '315',
    width: '100%',
    videoId: id,
    autoplay: 0,
    controls: 0,
    modestbranding:1,
    playerVars: {
      'playsinline': 1
    }, 
    events: { 
      'onReady': onPlayerReady, 
      'onStateChange': onPlayerStateChange
    } 
  }); 
}; 

function onPlayerReady (event) {
  event.target.stopVideo();
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done && connect == 1) {
    setTimeout(function() {
      stopVideo();
      getMusicInfo();
      targetChooseTheme.style.visibility = "visible";
      targetVideo.style.visibility = "hidden";

    } , 4500);
    done = true;
  } else if (event.data == YT.PlayerState.PLAYING && !done && connect > 1) {
    setTimeout(function() {
      stopVideo();
      targetAnswerBtn.style.visibility = "visible";
      targetPlayBtn.style.visibility = "visible";
    } , seconds * 1000);
    done = true;
  }
}

function changeVideo(videoId) {
  player.loadVideoById(videoId);
}

// 재생하는거
function playVideo() {
  player.playVideo();
}

// 음 초기화하는거? 멈추면 0초로 가는거있져?
function stopVideo() {
  player.stopVideo();
}

// 그냥 그 시점에 멈추는 거
function pauseVideo() {
  player.pauseVideo();
}

/////
/////
/////
/////
