/**
 * 碗底青 (Wandiqing) | Neural Interface Logic v3.8
 * Final Anchor: Path Correction & Protocol Safety Audit
 */

// --- 1. Global Utility: Message Appending & Scroll ---
window.addMessage = function(type, text, isHTML = false) {
    const chatContainer = document.getElementById('chat-history');
    if (!chatContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    if (isHTML) {
        msgDiv.innerHTML = text;
    } else {
        msgDiv.innerText = text;
    }
    chatContainer.appendChild(msgDiv);
    
    // Auto-scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // TTS Logic Hook
    if (type === 'agent' && !isHTML) {
        window.speak(text);
    }
};

// --- 1.1. Speech Synthesis Engine (TTS) ---
const synth = window.speechSynthesis;
let audioCtx = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

window.speak = function(text) {
    if (!synth) return;
    
    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Voice Selection
    const voices = synth.getVoices();
    const targetVoice = voices.find(v => v.name.includes('Microsoft Xiaoxiao') || v.name.includes('Google 普通话')) 
                     || voices.find(v => v.lang === 'zh-CN');
    
    if (targetVoice) {
        utterance.voice = targetVoice;
    }

    synth.speak(utterance);
};

// --- 2. Static Asset Infusion ---
function appendStaticData(type, data, isNovel = false) {
    let styledContent = '';
    if (isNovel) {
        styledContent = `
            <div style="white-space: pre-wrap; max-height: 400px; overflow-y: auto; padding: 15px; background: rgba(0,255,153,0.05); border: 1px solid rgba(0,255,153,0.3); margin-top: 10px; font-size: 14px; line-height: 1.6;">
                ${data}
            </div>
        `;
    } else {
        styledContent = `
            <div style="white-space: pre-wrap; padding: 10px; background: rgba(0,255,153,0.02); margin-top: 10px; font-size: 15px;">
                ${data}
            </div>
        `;
    }
    addMessage('agent', styledContent, true);
}

// --- 3. Magic Button Overrides ---
// --- 3. Business Logic Encapsulation (Trigger Matrix) ---
function triggerNovel() {
    const text = typeof novelData !== 'undefined' ? novelData : '[错误] 小说内容未加载';
    appendStaticData('novel', text, true);
    window.speak("正在为您提取《碗底青》小说核心文本...");
}

function triggerLyrics() {
    const text = typeof lyricsData !== 'undefined' ? lyricsData : '[错误] 歌词内容未加载';
    appendStaticData('lyrics', text, false);
    window.speak("正在同步灵境底层的歌词数据...");
}

function triggerCast() {
    const castHTML = `
        <div class="cast-matrix-message" style="margin-top: 15px; padding: 10px; background: rgba(0, 255, 153, 0.05); border: 1px solid rgba(0, 255, 153, 0.2); border-radius: 8px;">
            <div style="color: #00FF99; margin-bottom: 10px; font-weight: bold; font-size: 14px;">[模块激活：角色矩阵] 灵体已就位：</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="text-align: center;">
                    <img src="${encodeURI('./assets/（小青蛇精）@mmmmmmmm1.verdantnam.webp')}" style="width: 100%; max-width: 120px; border-radius: 8px; border: 1px solid rgba(0, 255, 153, 0.5);">
                    <div style="margin-top: 5px; color: #fff; font-size: 14px;">小青</div>
                </div>
                <div style="text-align: center;">
                    <img src="${encodeURI('./assets/（恶霸）@mmmmmmmm1.ironviperh.webp')}" style="width: 100%; max-width: 120px; border-radius: 8px; border: 1px solid rgba(0, 255, 153, 0.5);">
                    <div style="margin-top: 5px; color: #fff; font-size: 14px;">龙虾</div>
                </div>
                <div style="text-align: center;">
                    <img src="${encodeURI('./assets/（男主）@mmmmmmmm1r.webp')}" style="width: 100%; max-width: 120px; border-radius: 8px; border: 1px solid rgba(0, 255, 153, 0.5);">
                    <div style="margin-top: 5px; color: #fff; font-size: 14px;">张鹏</div>
                </div>
                <div style="text-align: center;">
                    <img src="${encodeURI('./assets/（女主）@christinamontoya.webp')}" style="width: 100%; max-width: 120px; border-radius: 8px; border: 1px solid rgba(0, 255, 153, 0.5);">
                    <div style="margin-top: 5px; color: #fff; font-size: 14px;">白蛇</div>
                </div>
            </div>
        </div>
    `;
    addMessage('agent', castHTML, true);
    window.speak("角色矩阵已激活，灵体已就位。");
}

function triggerVideo() {
    const text = '[视觉引擎激活] 渲染引擎已就绪，正在同步 Bilibili 外部信道...';
    addMessage('agent', text);
    window.speak(text);
    const videoModal = document.getElementById('video-modal');
    if (videoModal) videoModal.style.display = 'block';
}

window.openModal = function(type) {
    if (type === 'novel') triggerNovel();
    else if (type === 'lyrics') triggerLyrics();
    else if (type === 'cast') triggerCast();
    else if (type === 'video') triggerVideo();
};

window.closeAllModals = function() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => m.style.display = 'none');
};

// --- 4. Speech API & Command Router ---
function routeCommand(text) {
    const cmd = text.toLowerCase().trim().replace(/\s+/g, '');
    const map = {
        '1': triggerNovel,
        '1-小说': triggerNovel,
        '小说': triggerNovel,
        '2': triggerLyrics,
        '2-歌词': triggerLyrics,
        '歌词': triggerLyrics,
        '3': triggerCast,
        '3-演员': triggerCast,
        '演员': triggerCast,
        '4': triggerVideo,
        '4-视频': triggerVideo,
        '视频': triggerVideo
    };
    
    if (map[cmd]) {
        map[cmd]();
        return true;
    }
    return false;
}

// --- 5. Main Interaction Wire-up ---
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceCallBtn = document.getElementById('voice-call-btn');
    const videoVisionBtn = document.getElementById('video-vision-btn');
    const charAvatar = document.getElementById('main-avatar');

    function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;
        
        addMessage('user', text);
        userInput.value = '';
        
        // Command Routing Logic
        const isCommand = routeCommand(text);
        
        if (!isCommand) {
            setTimeout(() => {
                const fallbackText = "感知到主理人的意志，西湖底的算力正在波动...";
                addMessage('agent', fallbackText);
            }, 1000);
        }
    }

    if (sendBtn) sendBtn.addEventListener('click', () => { handleSend(); initAudioContext(); });
    if (userInput) {
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                initAudioContext();
            }
        });
    }

    // Audio Context Bypass (Bridge User Gesture)
    [sendBtn, voiceCallBtn, videoVisionBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', initAudioContext);
    });
    document.querySelectorAll('.aui-btn').forEach(btn => {
        btn.addEventListener('click', initAudioContext);
    });

    // --- Web Speech API (Diagnostic Override) ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition && voiceCallBtn) {
        voiceCallBtn.addEventListener('click', () => {
            addMessage('system', '<span style="color: #ff4444;">[神思核心警告] 当前浏览器内核已被阉割，不支持全息声纹识别 API。</span>', true);
        });
    } else if (SpeechRecognition && voiceCallBtn) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let isRecording = false;

        voiceCallBtn.addEventListener('click', () => {
            if (isRecording) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (e) {
                    addMessage('system', `<span style="color: #ff4444;">[神思启动异常] 唤醒失败: ${e.message}</span>`, true);
                }
            }
        });

        recognition.onstart = () => {
            isRecording = true;
            voiceCallBtn.style.background = '#FF3366';
            voiceCallBtn.style.boxShadow = '0 0 20px #FF3366';
            if (userInput) userInput.placeholder = "正在监听神思主理人指令...";
        };

        recognition.onend = () => {
            isRecording = false;
            voiceCallBtn.style.background = '';
            voiceCallBtn.style.boxShadow = '';
            if (userInput) userInput.placeholder = "输入指令或呼唤她的名字...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (userInput) {
                userInput.value = transcript;
                handleSend(); // Auto-trigger send & route
            }
        };

        recognition.onerror = (event) => {
            addMessage('system', `<span style="color: #ff4444;">[神思声纹异常] 麦克风连接断开，原因代码: ${event.error}</span>`, true);
            console.error('Speech Recognition Diagnostic:', event.error);
        };
    }

    // Vision Sensor Bridge
    let stream = null;
    if (videoVisionBtn) {
        videoVisionBtn.addEventListener('click', async () => {
            const charFrame = document.querySelector('.char-frame');
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
                videoVisionBtn.classList.remove('active');
                if (charAvatar) charAvatar.style.display = "block";
                const v = document.getElementById('vision-stream');
                if (v) v.remove();
            } else {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    const videoElement = document.createElement('video');
                    videoElement.id = "vision-stream";
                    videoElement.srcObject = stream;
                    videoElement.autoplay = true;
                    videoElement.style.cssText = "width:100%; height:100%; object-fit:cover;";
                    if (charAvatar) charAvatar.style.display = "none";
                    if (charFrame) charFrame.appendChild(videoElement);
                    videoVisionBtn.classList.add('active');
                } catch (err) { console.error('Vision Sync Failed:', err); }
            }
        });
    }

    console.log('// Neural Asset Bridge: FULLY_ANCHORED');
});
