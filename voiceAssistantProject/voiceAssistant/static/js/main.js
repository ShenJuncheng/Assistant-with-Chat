// voiceAssistant/static/js/main.js
let isRecording = false;
let audioRecorder;

function textToSpeech(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'zh-CN'; // 设置语言
    window.speechSynthesis.speak(speech); // 播放语音
}

document.addEventListener('DOMContentLoaded', function() {
    let mediaRecorder;
    let audioChunks = [];

    document.getElementById('recordButton').addEventListener('click', function() {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioChunks = [];
                    // 你可以在这里做更多的事情，比如上传 blob 到服务器
                };
                mediaRecorder.start();
                this.classList.add('recording');
            })
            .catch(error => {
                console.error('Error accessing the microphone', error);
            });
        } else if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            this.classList.remove('recording');
        }
    });

    document.getElementById('sendButton').addEventListener('click', function() {
        const userInput = document.getElementById('textInput').value + '回答最多不超过100字';
        fetch('/chat-with-gpt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `text=${encodeURIComponent(userInput)}`
        })
        .then(response => response.json())
        .then(data => {
            // 显示到info里，f12的
            console.log('GPT-3 Response:', data.response);

            // 将回应显示到页面上
            // 确保您的HTML中有一个ID为'gptResponse'的元素
            const responseElement = document.getElementById('gptResponse');
            if(responseElement) {
                responseElement.innerText = data.response;
                textToSpeech(data.response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const responseElement = document.getElementById('gptResponse');
            if(responseElement) {
                responseElement.innerText = '发生错误，无法获取回复。';
            }
        });
    });
});


