// target 위치들
var targetTitle = document.getElementById("Title");
var targetArtist = document.getElementById("Artist");
var targetAnswer = document.getElementById("answerZone");
var targetAnswerBtn = document.getElementById("answerBtn");
var targetPlayBtn = document.getElementById("playBtn");
var targetVideo = document.getElementById("videoZone");
var targetAlbumArt = document.getElementById("albumArt");
targetAnswer.style.visibility = "hidden";
targetAnswerBtn.style.visibility = "hidden";
targetAlbumArt.style.visibility = "hidden";

var audio = new Audio('clickEffect.m4a');

//비동기방식으로 아이프레임 플레이어 API 코드를 불러옵니다. 
var tag = document.createElement('script'); 
tag.src = "https://www.youtube.com/player_api"; 
var firstScriptTag = document.getElementsByTagName('script')[0]; 
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 노래관련 변수들
var id = "gE9vcSbENwo"; // 인트로 영상 주소임
var title = "junsik forever";
function getMusicInfo() {
  let random = Math.floor((Math.random() * (50 - 0) + 0));

  fetch("http://junsik-universe.com/music.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    id = json.music[random].id;
    title = json.music[random].Title;
    artist = json.music[random].Artist;
  }); 
}

// 정답보기 버튼 누른후 실행 하는거
function showAnswer() {
    audio.play();
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

function musicOn() {
  targetPlayBtn.style.visibility = "hidden";
  targetAnswerBtn.style.visibility = "hidden";
  playVideo();
  count++;
}

function playIntro() {
  player.playVideo();
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
      targetPlayBtn.style.visibility = "visible";
      targetVideo.style.visibility = "hidden";
    } , 4500);
    done = true;
  } else if (event.data == YT.PlayerState.PLAYING && !done && connect > 1) {
    setTimeout(function() {
      stopVideo();
      targetAnswerBtn.style.visibility = "visible";
      targetPlayBtn.style.visibility = "visible";
    } , 3000);
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