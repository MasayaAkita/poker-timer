let level = 1;
let timeLeft = 600;  // 10 minutes in seconds

// BB/SBのリスト（[BB, SB]）→ [BB, SB] から [SB, BB] に修正
const blindLevels = [
    [10, 5],    // LEVEL1 (BB=10, SB=5)
    [20, 10],   // LEVEL2
    [50, 25],   // LEVEL3
    [100, 50],  // LEVEL4
    [150, 75],   // LEVEL5
    [200, 100],  // LEVEL6
];

let bigBlind = blindLevels[0][0];
let smallBlind = blindLevels[0][1];
let ante = bigBlind;
let nextBB = blindLevels[1] ? blindLevels[1][0] : bigBlind * 2;
let nextSB = blindLevels[1] ? blindLevels[1][1] : smallBlind * 2;
let nextAnte = nextBB;
let customMode = false; // 入力フォームから設定されたらtrue
let customTime = 600;

let timerInterval;
let isPaused = false;

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('time').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    timeLeft--;
    if (timeLeft < 0) {
        nextLevel();
        // timeLeftはcustomModeならcustomTime、そうでなければ300
        timeLeft = customMode ? customTime : 600;
    }
}

function nextLevel() {
    level++;
    if (!customMode) {
        // 通常モード: blindLevels配列を使う
        if (level <= blindLevels.length) {
            bigBlind = blindLevels[level - 1][0];
            smallBlind = blindLevels[level - 1][1];
        } else {
            bigBlind *= 2;
            smallBlind *= 2;
        }
        ante = bigBlind;
        // 次のレベルのBB/SB/Ante
        if (level < blindLevels.length) {
            nextBB = blindLevels[level][0];
            nextSB = blindLevels[level][1];
        } else {
            nextBB = bigBlind * 2;
            nextSB = smallBlind * 2;
        }
        nextAnte = nextBB;
    } else {
        // カスタムモード: 入力値を倍にしていく
        bigBlind *= 2;
        smallBlind *= 2;
        ante *= 2;
        // NextBlindsも倍に
        let nextBlindsInput = document.getElementById('input-next-blinds').value;
        // nextBlindsInputは "BB/SB(Ante)" の形式
        let match = nextBlindsInput.match(/^(\d+)\s*\/\s*(\d+)\s*\((\d+)\)$/);
        if (match) {
            let nbb = parseInt(match[1], 10) * 2;
            let nsb = parseInt(match[2], 10) * 2;
            let nante = parseInt(match[3], 10) * 2;
            nextBB = nbb;
            nextSB = nsb;
            nextAnte = nante;
            document.getElementById('input-next-blinds').value = `${nbb}/${nsb}(${nante})`;
        } else {
            // フォーマットが違う場合は自動計算
            nextBB = bigBlind * 2;
            nextSB = smallBlind * 2;
            nextAnte = ante * 2;
            document.getElementById('input-next-blinds').value = `${nextBB}/${nextSB}(${nextAnte})`;
        }
    }

    document.getElementById('level').textContent = `LEVEL ${level}`;
    const bigSmallBlindDiv = document.querySelector('#big-small-blind div');
    if (bigSmallBlindDiv) bigSmallBlindDiv.textContent = `${bigBlind}/${smallBlind}`;
    const anteDiv = document.querySelector('#ante div');
    if (anteDiv) anteDiv.textContent = `${ante}`;
    const nextBigSmallBlindDiv = document.querySelector('#next-big-small-blind div');
    if (nextBigSmallBlindDiv) nextBigSmallBlindDiv.textContent = `${nextBB}/${nextSB}(${nextAnte})`;
}

document.getElementById('reset-button').addEventListener('click', function() {
    level = 1;
    timeLeft = 600; // 通常モードの初期制限時間
    customMode = false; // ★リセット時は通常モードに戻す

    bigBlind = blindLevels[0][0];
    smallBlind = blindLevels[0][1];
    ante = bigBlind;
    nextBB = blindLevels[1][0];
    nextSB = blindLevels[1][1];
    nextAnte = nextBB;

    document.getElementById('level').textContent = `LEVEL ${level}`;
    document.getElementById('time').textContent = `5:00`;
    const bigSmallBlindDiv = document.querySelector('#big-small-blind div');
    if (bigSmallBlindDiv) bigSmallBlindDiv.textContent = `${bigBlind}/${smallBlind}`;
    const anteDiv = document.querySelector('#ante div');
    if (anteDiv) anteDiv.textContent = `${ante}`;
    const nextBigSmallBlindDiv = document.querySelector('#next-big-small-blind div');
    if (nextBigSmallBlindDiv) nextBigSmallBlindDiv.textContent = `${nextBB}/${nextSB}(${nextAnte})`;

    if (timerInterval) {
        clearInterval(timerInterval);
    }
    isPaused = false;
    document.getElementById('stop-button').disabled = false;
    document.getElementById('resume-button').disabled = true;
    timerInterval = setInterval(updateTimer, 1000);
});

document.getElementById('stop-button').addEventListener('click', function() {
    clearInterval(timerInterval);
    isPaused = true;
    document.getElementById('stop-button').disabled = true;
    document.getElementById('resume-button').disabled = false;
});

document.getElementById('resume-button').addEventListener('click', function() {
    if (isPaused) {
        timerInterval = setInterval(updateTimer, 1000);
        isPaused = false;
        document.getElementById('stop-button').disabled = false;
        document.getElementById('resume-button').disabled = true;
    }
});

// 設定フォームの値を反映する
function applySettings() {
    // 入力値取得
    const min = parseInt(document.getElementById('input-time').value, 10);
    const bb = parseInt(document.getElementById('input-bb').value, 10);
    const sb = parseInt(document.getElementById('input-sb').value, 10);
    // AnteはBBに自動で合わせる
    let nextBlindsVal = document.getElementById('input-next-blinds').value;

    // 値を反映
    level = 1;
    timeLeft = min * 60;
    customTime = min * 60;
    bigBlind = bb;
    smallBlind = sb;
    ante = bigBlind;
    customMode = true;

    // NextBlindsの初期値をパース
    let match = nextBlindsVal.match(/^(\d+)\s*\/\s*(\d+)\s*\((\d+)\)$/);
    if (match) {
        nextBB = parseInt(match[1], 10);
        nextSB = parseInt(match[2], 10);
        nextAnte = parseInt(match[3], 10);
    } else {
        nextBB = bigBlind * 2;
        nextSB = smallBlind * 2;
        nextAnte = ante * 2;
        document.getElementById('input-next-blinds').value = `${nextBB}/${nextSB}(${nextAnte})`;
    }

    document.getElementById('level').textContent = `LEVEL ${level}`;
    document.getElementById('time').textContent = `${min}:00`;
    const bigSmallBlindDiv = document.querySelector('#big-small-blind div');
    if (bigSmallBlindDiv) bigSmallBlindDiv.textContent = `${bigBlind}/${smallBlind}`;
    const anteDiv = document.querySelector('#ante div');
    if (anteDiv) anteDiv.textContent = `${ante}`;
    const nextBigSmallBlindDiv = document.querySelector('#next-big-small-blind div');
    if (nextBigSmallBlindDiv) nextBigSmallBlindDiv.textContent = `${nextBB}/${nextSB}(${nextAnte})`;

    // タイマーリセット
    if (timerInterval) clearInterval(timerInterval);
    isPaused = false;
    document.getElementById('stop-button').disabled = false;
    document.getElementById('resume-button').disabled = true;
    timerInterval = setInterval(updateTimer, 1000);
}

document.getElementById('apply-settings').addEventListener('click', applySettings);

// HTML側の初期値をJSの初期値で上書き
window.addEventListener('DOMContentLoaded', function() {
    ante = bigBlind;
    customMode = false;
    document.getElementById('level').textContent = `LEVEL ${level}`;
    document.getElementById('time').textContent = `${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`;
    const bigSmallBlindDiv = document.querySelector('#big-small-blind div');
    if (bigSmallBlindDiv) bigSmallBlindDiv.textContent = `${bigBlind}/${smallBlind}`;
    const anteDiv = document.querySelector('#ante div');
    if (anteDiv) anteDiv.textContent = `${ante}`;
    const nextBigSmallBlindDiv = document.querySelector('#next-big-small-blind div');
    nextBB = blindLevels[1][0];
    nextSB = blindLevels[1][1];
    nextAnte = nextBB;
    if (nextBigSmallBlindDiv) nextBigSmallBlindDiv.textContent = `${nextBB}/${nextSB}(${nextAnte})`;

    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('stop-button').disabled = false;
    document.getElementById('resume-button').disabled = true;
});
