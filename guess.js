//비동기방식으로 아이프레임 플레이어 API 코드를 불러옵니다. 
var tag = document.createElement('script'); 
tag.src = "https://www.youtube.com/player_api"; 
var firstScriptTag = document.getElementsByTagName('script')[0]; 
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 

// api 코드 다운로드 후 제어관련 함수 생성. 
var player; 
function onYouTubePlayerAPIReady() { 
  player = new YT.Player('player', {
    height: '315',
    width: '560', 
    videoId: '04tYkKUPPv4',
    playerVars: {
      'playsinline': 1
    }, 
    events: { 
      'onReady': onPlayerReady, 
    } 
  }); 
}; 
// api 음소거 함수호출 
function onPlayerReady (event) {
  event.target.playVideo();
  //event.target.mute();
  //event.target.unmute();
}

//<iframe width="560" height="315" src="https://www.youtube.com/embed/04tYkKUPPv4?controls=0" title="YouTube video player"></iframe>