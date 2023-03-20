// DOM 요소들을 가져오기
let api_key = '';
let isFirst = false;
const chatLog = document.querySelector(".chatlog");
const inputBox = document.querySelector(".input-box textarea");
const clock = document.querySelector(".clock");
let isUser = false;
let prefix = '';
let promptMsg = '생각중...';

// API 키를 저장한 쿠키 이름
const cookieName = 'chatBot_key';

// ChatGPT API 요청 함수
async function getAnswerFromChatGPT(question) {
  inputBox.disabled = true;
  inputBox.value = promptMsg;
  //const url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  const url = 'https://api.openai.com/v1/chat/completions'
  const prompt = prefix + question + '\n';
  const headers = {
    "Authorization": "Bearer " + api_key,
    "Content-Type":"application/json"
  }
  // const data = {
  //   "model": "gpt-3.5-turbo",
  //   "prompt": prompt,
  //   "max_tokens": 1000
  // };
  const data = {
    "model": 'gpt-3.5-turbo',
    'messages': [{'role': 'user', 'content': prompt}]
  }
  // const headers = {
  //   'Content-Type': 'application/json',
  //   'Authorization': api_key // API_KEY는 본인의 API Key로 대체해야 함
  // };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });
  const json = await response.json();
  console.log(json);
  // if (!json.choices || !json.choices.length || !json.choices[0].text) {
  //   // 반환된 데이터에 문제가 있음
  //   throw new Error('Failed to get a response from ChatGPT');
  // }
  return json.choices[0].message.content.trim();
  //return json.choices[0].text.trim();
}

// 채팅 로그에 새로운 메시지 추가하는 함수
function addMessage(message) {
  const timestamp = new Date().toLocaleTimeString("ko-KR"); // en-US ko-KR

  const logEntry = document.createElement("div");

  // inputBox 접근 불가하게
  inputBox.value = "로딩중...";
  inputBox.disabled = true;

  logEntry.classList.add("log-entry");

  const logEntryText = document.createElement("pre"); // div -> pre pre의 문제가 옆으로 나열되넴,,
  
  //logEntryText.textContent = message;
  if (isUser) {
    logEntryText.classList.add("log-entry-text-user");
  } else {
    logEntryText.classList.add("log-entry-text");
  }
  let index = 0;
  const words = message.split(" ");
  function displayWords() {
    inputBox.disabled = true;
    if (index < words.length) {
      // 스크롤 맨 아래로 내리기
      chatLog.scrollTop = chatLog.scrollHeight;
      logEntryText.textContent += words[index] + ' ';
      index++;
      const randomNum = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
      if (!isUser && index === words.length) {
        inputBox.disabled = false;
        inputBox.value = "";
        document.querySelector("#input-text").focus();
      } else {
        setTimeout(displayWords, randomNum); // 50ms 마다 한 글자씩 추가
      }
      
    }
    if(isUser) {
      inputBox.disabled = true;
      inputBox.value = promptMsg;
    }
    // 스크롤 맨 아래로 내리기
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  displayWords();
  inputBox.disabled = false;
  const logEntryTimestamp = document.createElement("div");
  if(isUser) {
    logEntryTimestamp.classList.add("timestamp-user");
  } else {
    logEntryTimestamp.classList.add("timestamp");
  }
  logEntryTimestamp.textContent = timestamp;

  logEntry.appendChild(logEntryText);
  logEntry.appendChild(logEntryTimestamp);
  chatLog.appendChild(logEntry);

  // 스크롤 맨 아래로 내리기
    chatLog.scrollTop = chatLog.scrollHeight;
}

// 입력받은 메시지 처리하는 함수
async function processInput() {
  const message = inputBox.value.trim();
  if (!message) {
    return;
  }
  if(message === '/reset') {
    addMessage('리셋됩니다.');
    api_key = '';
    document.cookie = `${cookieName}=${api_key};path=/`;
    location.reload()
    return;
  }
  if (isFirst && api_key === '') {
    addMessage('api key를 입력하세요.');
    isUser = false;
    isFirst = false;
    return;
  } else if (!isFirst && api_key === '') {
    isUser = false;
    // 쿠키에 API 키 저장
    api_key = message;
    document.cookie = `${cookieName}=${api_key};path=/`;
    addMessage('api key가 입력되었습니다.');
    return;
  }
  if (message === '/clear') {
    location.reload()
    return;
  } else if (message === '/기본') {
    prefix = '';
    promptMsg = '생각중...';
    addMessage('기본 채팅모드로 변경합니다!');
    isUser = false;
    return;
  } else if (message === '/번역') {
    prefix = '번역해줘: ';
    promptMsg = '번역중...';
    addMessage(message);
    isUser = false;
    return;
  } else if (message === '/') {
    isUser = false;
    promptMsg = '생각중...';
    prefix = '';
    let text = '"/" 입력후 원하시는 서비스를 입력하면 보다 편하게 서비스를 이용 하실 수 있습니다.'+ '\n\n' + '현재는 다음과 같은 서비스를 제공하고 있습니다.' + '\n\n';
    text += '/clear -> 대화 내용을 모두 삭제합니다.' + '\n';
    text += '/번역 -> 빠르게 번역을 해드립니다.' + '\n';
    text += '/문법 -> 빠르게 문법을 확인해드립니다.' + '\n';
    text += '/speaking -> 영어로 대화를 계속 합니다.';
    addMessage(text);
    return;
  } else if (message === '/문법') {
    isUser = false;
    prefix = 'check grammar with explanation:\n';
    promptMsg = '문법 검사중...';
    addMessage(message);
    return;
  } else if (message === '/speaking') {
    isUser = false;
    prefix = 'Could you please help me improve my English speaking skills by checking my grammar and helping me engage in small talk? It would be great if you could act like a person and chat with me.:\n'
    promptMsg = 'thinking...';
    addMessage(message);
    const answer = await getAnswerFromChatGPT(prefix);
    isUser = false;
    addMessage(answer);
    speak(answer);
    prefix = "Current your role is a speaking teacher, so continuing the small talk with checking grammar. start with next sentences:\n";
    return;
  }
  isUser = true;
  addMessage(message);
  //inputBox.value = "";
  console.log(message);
  const answer = await getAnswerFromChatGPT(message);
  if(prefix === "Current your role is a speaking teacher, so continuing the small talk with checking grammar. start with next sentences:\n") {
    speak(answer);
  }
  isUser = false;
  addMessage(answer);
}

// 클립보드에 복사하는 함수
// function copyToClipboard(text) {
//   navigator.clipboard.writeText(text)
//     .then(() => console.log('Copied to clipboard'))
//     .catch((error) => console.error('Failed to copy:', error));
// }

// 엔터 키 이벤트 처리
inputBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    processInput();
  }
});

// 시계 업데이트 함수
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// tts
function speak(text) {
  const synth = window.speechSynthesis;
  const message = new SpeechSynthesisUtterance(text);
  message.volume = 1;
  message.rate = 1;
  message.pitch = 1;
  synth.speak(message);
}


// 리로드 되면 바로 텍스트박스로
window.onload = function() {
  // 쿠키에서 API 키 가져오기
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${cookieName}=`)) {
      api_key = cookie.substring(`${cookieName}=`.length, cookie.length);
      break;
    }
  }
  document.querySelector("#input-text").focus();
};

// API 키가 없으면 사용자에게 다시 입력 받도록 알림
if (api_key === '') {
  isFirst = true;
}


// 시계 업데이트 함수 호출
updateClock();
setInterval(updateClock, 1000);
