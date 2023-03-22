let hasApiKey = false;
let api_key = '';
let isUser = false;
let isSetup = false;
let setupIndex = 0;
let prefix = '짧은댓글 여러개 달아줘: \n';
let isNews = false;

// API 키를 저장한 쿠키 이름
const cookieName = 'chatBot_key';

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
  };
	// API 키가 없으면 사용자에게 다시 입력 받도록 알림
	if (api_key === '') {
		addBotBubble("api 키를 입력하세요");
		hasApiKey = false;
	} else {
		hasApiKey = true;
	}
};

// message 계속 이어가게
let data = {
  "model": 'gpt-3.5-turbo',
  'messages': [{'role': 'system', 'content': 'You are a helpful assistant.'},]
}

// ChatGPT API 요청 함수
async function getAnswerFromChatGPT(question) {
  const url = 'https://api.openai.com/v1/chat/completions'
  const prompt = question + '\n';
  const headers = {
    "Authorization": "Bearer " + api_key,
    "Content-Type":"application/json"
  }
  data.messages.push({'role' : 'user', 'content': prompt});
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });
  const json = await response.json();
  console.log(json);
  return json.choices[0].message.content.trim();
}


// HTML 코드에서 #chat-history 요소를 선택합니다.
const chatHistory = document.querySelector("#chat-history");
let setupArray = [];
let setupPrompt = '';

// Send 버튼을 클릭할 때 호출되는 함수입니다.
async function sendUserInput() {
  // 사용자가 입력한 메시지를 가져옵니다.
  const userInput = document.querySelector("#user-input").value;

  if (userInput === '') {
    return;
  }
	if (!hasApiKey) {
		api_key = userInput;
  	document.cookie = `${cookieName}=${api_key};path=/`;
  	addBotBubble('api key가 입력되었습니다.');
		hasApiKey = true;
		return;
	}

	addUserBubble(userInput);
	if (!isSetup) {
		setupArray.push(userInput);
		setupIdol();
		return;
	}
	const randomNum = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
	if (randomNum === 1) {
		isNews = true;
	}
	if (isNews) {
		prefix = '실제 기사처럼 여러 기사 작성해줘. 기사형식 [기사회사] --- 내용:\n';
		setTimeout(addBotBubble('기사봇 --- 특종이 뜬거 같아요! 곧 기사가 뜹니다!'), 1000);
		isNews = false;
	}
	const answer = await getAnswerFromChatGPT(prefix + userInput);
	data.messages.push({'role' : 'assistant', 'content': answer});
	setTimeout(function() {
		document.querySelector("#user-input").value = '';
		//document.querySelector("#user-input").focus();
	}, 100);
	if (prefix === '실제 기사처럼 여러 기사 작성해줘. 기사형식 [기사회사] --- 내용:\n') {
		addBotBubble(answer);
	} else {
		seperateAnswer(answer);
	}
	isNews = false;
	prefix = '질문 또는 응원하는 짧은댓글 여러개 달아줘: \n';
}

async function setupIdol() {
	switch(setupIndex) {
		case 0:
			addBotBubble("활동명을 알려주세요");
			break;
		case 1:
			addBotBubble("생년월일을 입력하세요.(yyyy.mm.dd)");
			break;
		case 2:
			addBotBubble("별명을 입력하세요. 여러개면 콤마로 구분");
			break;
		case 3:
			addBotBubble("데뷔일을 입력하세요.(yyyy.mm.dd)");
			break;
		case 4:
			addBotBubble("팬덤명을 입력하세요: ");
			break;
		default:
			addBotBubble("곧 시작될 예정입니다. 잠시만 기다려주세요");
			setupPrompt += '내 정보를 알려줄게.\n';
			setupPrompt += '이름: ' + setupArray[0] + '.\n';
			setupPrompt += '생년월일: ' + setupArray[1] + '.\n';
			setupPrompt += '데뷔일: ' + setupArray[3] + '.\n';
			setupPrompt += '나의 별명: ' + setupArray[2] + '.\n';
			setupPrompt += '팬덤이름: ' + setupArray[4] + '.\n';
			setupPrompt += '너는 지금부터 나를 굉장히 좋아하는 나의 수많은 팬 처럼 행동해.\n';
			setupPrompt += '짧은 댓글 여러개 달아줘. 응원, 질문, 다양하게, 가끔씩 이모지 사용해.\n';
			setupPrompt += '댓글 형식은 이렇게: 랜덤이름들 --- 내용.\n';
			isSetup = true;

			const answer = await getAnswerFromChatGPT(setupPrompt);
			data.messages.push({'role' : 'assistant', 'content': answer});
			setTimeout(function() {
				document.querySelector("#user-input").value = '';
				//document.querySelector("#user-input").focus();
			}, 100);
			seperateAnswer(answer);
	}
	setupIndex++;
}

function seperateAnswer(answer) {
	const answers = answer.split('\n');
	let index = 0;

	function displayAnswer() {
    if (index < answers.length) {
			if (answers[index] != '') {
				addBotBubble(answers[index]);
			}
      index++;
      const randomNum = Math.floor(Math.random() * (200 - 10 + 1)) + 10;
      setTimeout(displayAnswer, randomNum);
      
    }
	}
	displayAnswer();
}

function addUserBubble(userInput) {
	// 현재 시간을 구합니다.
	const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	// 메시지를 추가할 요소를 생성합니다.
	const messageText = document.createElement("pre");
	const messageTime = document.createElement("p");
	const messageContainer = document.createElement("div");
	const messageBubble = document.createElement("div");

	// 요소에 클래스를 추가합니다.
	messageTime.classList.add("message-time");
	messageContainer.classList.add("user-message-container");
	messageBubble.classList.add("user-message-bubble");
	messageText.classList.add("message-text");

	// 요소에 사용자가 입력한 메시지와 현재 시간을 추가합니다.
	messageText.textContent = userInput;
	messageTime.textContent = currentTime;

	// 요소를 채팅창에 추가합니다.
	messageContainer.appendChild(messageTime);
	messageContainer.appendChild(messageBubble);
	messageBubble.appendChild(messageText);
	chatHistory.appendChild(messageContainer);

	// 입력창을 초기화합니다.
	document.querySelector("#user-input").value = null;
	document.querySelector("#user-input").value = '';

	// 입력창의 높이를 자동으로 조절합니다.
	adjustUserInputHeight();
	chatHistory.scrollTop = chatHistory.scrollHeight;
}

function addBotBubble(userInput) {
	// 현재 시간을 구합니다.
	const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	// 메시지를 추가할 요소를 생성합니다.
	const messageTime = document.createElement("p");
	const botProfileImage = document.createElement("div");
	const botProfileName = document.createElement("p");
	const messageContainer = document.createElement("div");
	const messageBubble = document.createElement("div");
	const messageText = document.createElement("pre");
	const textContainer = document.createElement("div");

	// 요소에 클래스를 추가합니다.
	messageContainer.classList.add("bot-message-container");
	botProfileImage.classList.add("bot-profile-image");
	botProfileName.classList.add("bot-profile-name");
	messageBubble.classList.add("bot-message-bubble");
	messageText.classList.add("message-text");
	messageTime.classList.add("message-time");
	textContainer.classList.add("bot-text");

	// 요소에 사용자가 입력한 메시지와 현재 시간을 추가합니다.
	if (userInput.includes('---')) {
		botProfileName.textContent = userInput.split('---')[0];
		messageText.textContent = userInput.split('---')[1];
	} else {
		// handle case where userInput does not contain '-'
		botProfileName.textContent = 'beIDOL';
		messageText.textContent = userInput;
	}
	messageTime.textContent = currentTime;

	// 요소를 채팅창에 추가합니다.
	messageContainer.appendChild(botProfileImage);
	messageContainer.appendChild(textContainer);
	textContainer.appendChild(botProfileName);
	textContainer.appendChild(messageBubble);
	messageBubble.appendChild(messageText);
	messageContainer.appendChild(messageTime);
	chatHistory.appendChild(messageContainer);

	// 입력창을 초기화합니다.
	document.querySelector("#user-input").value = null;
	document.querySelector("#user-input").value = '';

	// 입력창의 높이를 자동으로 조절합니다.
	adjustUserInputHeight();
	chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 입력창의 높이를 자동으로 조절하는 함수입니다.
function adjustUserInputHeight() {
  const userInput = document.querySelector("#user-input");

  // 입력창의 높이를 자동으로 조절합니다.
  userInput.style.height = "auto";
  userInput.style.height = `${userInput.scrollHeight}px`;

  // 입력창이 화면 하단에 위치하도록 스크롤을 조절합니다.
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 입력창에서 엔터 키를 누를 때 호출되는 함수입니다.
function handleKeyPress(event) {
  if (event.keyCode === 13 && !event.shiftKey && document.querySelector("#user-input").value.trim() !== "") {
    event.preventDefault();
    sendUserInput();
  }
}

const userInputContainer = document.querySelector("#user-input-container");
const background = document.querySelector("#background");

function adjustBackgroundHeight() {
  const userInputContainerHeight = userInputContainer.offsetHeight;
  const windowHeight = window.innerHeight;

	// 채팅창의 높이를 계산합니다.
  const backgroundHeight = windowHeight - userInputContainerHeight - 10;

	//// 백그라운드 높이를 적용합니다.
  // background.style.height = `${windowHeight - userInputContainerHeight - 15}px`;
	background.style.height = `${backgroundHeight}px`;
	chatHistory.scrollTop = chatHistory.scrollHeight;
	
}



// 초기화 함수입니다.
function init() {
  // 입력창의 높이를 자동으로 조절합니다.
  adjustUserInputHeight();

  // 입력창에 이벤트 리스너를 등록합니다.
  const userInput = document.querySelector("#user-input");
  userInput.addEventListener("input", adjustUserInputHeight);
  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleKeyPress(event);
    } else if (event.key === "Enter" && event.shiftKey) { // Shift + Enter일 때
      event.preventDefault(); // 전송 막기
      userInput.value += "\n"; // 대신 개행 추가	
    }
  });

  userInput.addEventListener("input", () => {
    // 입력값이 없으면 입력창의 값을 빈 문자열로 설정합니다.
    if (userInput.value.trim() === '') {
      userInput.value = '';
    }
  });

	// 백그라운드 크기 조절
	adjustBackgroundHeight();
  window.addEventListener("resize", adjustBackgroundHeight);
	setupIdol(setupIndex);
}

// 초기화 함수를 호출합니다.
init();
