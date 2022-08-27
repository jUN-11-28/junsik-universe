// 제목관련
var targetTitle = document.getElementById("Title");
var targetArtist = document.getElementById("Artist");

// answerZone
var targetAnswer = document.getElementById("answerZone");
var targetAnswerBtn = document.getElementById("answerBtn");
targetAnswer.style.visibility = "hidden";
targetAnswerBtn.style.visibility = "hidden";


// json music fetch할려고 하는데 어케 하지,,,

var id;
var title;
function getMusicInfo() {
  let random = Math.floor( ( Math.random() * (3 - 0) + 0 ) );
    fetch("http://junsik-universe.com/music.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        console.log(json);
        id = json.music[random].id;
        title = json.music[random].Title;
        artist = json.music[random].Artist;
        targetTitle.innerText = title;
        targetArtist.innerText = artist;
        changeVideo(id);
      });
      
      
}


function showAnswer() {
  document.getElementById("Title").innerText = title;
  document.getElementById("Artist").innerText = artist;
  targetAnswer.style.visibility = "visible";
  targetAnswerBtn.style.visibility = "hidden";
  count = 0;
}

var count = 0;
var connect = 0; //첫번째 접속인지 확인
function playMusic() {
  
   
  if (count == 0) {
    getMusicInfo();
    //비동기방식으로 아이프레임 플레이어 API 코드를 불러옵니다. 
    var tag = document.createElement('script'); 
    tag.src = "https://www.youtube.com/player_api"; 
    var firstScriptTag = document.getElementsByTagName('script')[0]; 
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    playVideo();
  } else {
    playVideos();
  }
  connect = 1;
  //alert(count);
}

function changeVideo(videoId) {
    player.loadVideoById(videoId);
}

function next() {
  count = 0;
  //alert(count);
  targetAnswer.style.visibility = "hidden";
  
}

// api 코드 다운로드 후 제어관련 함수 생성. 
var player; 
function onYouTubePlayerAPIReady() { 
  player = new YT.Player('player', {
    height: '315',
    width: '560', 
    videoId: id,
    //autoplay: 1,
    playerVars: {
      'playsinline': 1
    }, 
    events: { 
      'onReady': onPlayerReady, 
      //'onStateChange': onPlayerStateChange
    } 
  }); 
}; 
//  
function onPlayerReady (event) {
  event.target.playVideo();
  //event.target.mute();
  //player.playVideo();
  //event.target.unmute();
}

function playVideo() {
  //setTimeout(playVideo(), 3000);
  //player.playVideo();
  setTimeout(function() {
    stopVideo();
  } , 3000);
  setTimeout(function() {
    targetAnswerBtn.style.visibility = "visible";
  } , 3000);
  count++;
}

function playVideos() {
  //setTimeout(playVideo(), 3000);
  player.playVideo();
  setTimeout(function() {
    stopVideo();
  } , 3000);
  setTimeout(function() {
    targetAnswerBtn.style.visibility = "visible";
  } , 3000);
}

/*
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    
    done = true;
  }
}
*/
function stopVideo() {
  player.stopVideo();
}

function pauseVideo() {
  player.pauseVideo();
}




//<iframe width="560" height="315" src="https://www.youtube.com/embed/04tYkKUPPv4?controls=0" title="YouTube video player"></iframe>
//https://music.youtube.com/watch?v=3d-D5bLDZSk&feature=share
