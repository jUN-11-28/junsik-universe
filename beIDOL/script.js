// HTML 코드에서 #chat-history 요소를 선택합니다.
const chatHistory = document.querySelector("#chat-history");

// Send 버튼을 클릭할 때 호출되는 함수입니다.
function sendUserInput() {
  // 사용자가 입력한 메시지를 가져옵니다.
  const userInput = document.querySelector("#user-input").value;

  if (userInput === '') {
    return;
  }

  // 현재 시간을 구합니다.
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 메시지를 추가할 요소를 생성합니다.
	const messageText = document.createElement("pre");
  const messageTime = document.createElement("p");
  const messageContainer = document.createElement("div");
  const messageBubble = document.createElement("div");

  // 요소에 클래스를 추가합니다.
  messageTime.classList.add("message-time");
  messageContainer.classList.add("message-container");
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
  document.querySelector("#user-input").value = "";

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
}

// 초기화 함수를 호출합니다.
init();
