let stopSheet;
let rollSheet;
let stopAnimation = [];
let rollAnimation = [];
let jumpSheet;
let jumpAnimation = [];
let lightningSheet;
let lightningAnimation = [];
let boomSheet;
let boomAnimation = [];
let stopSheet2;
let stopAnimation2 = [];
let questionSheet;
let questionAnimation = [];



const stopFrameCount = 15;
const stopFrameWidth = 745 / 15;

const rollFrameCount = 10;
const rollFrameWidth = 705 / 10; // 70.5
const rollFrameHeight = 53;

const jumpFrameCount = 12;
const jumpFrameWidth = 679 / 12; // 56.58...
const jumpFrameHeight = 52;

const lightningFrameCount = 12;
const lightningFrameWidth = 883 / 12; // 73.58...
const lightningFrameHeight = 152;

const boomFrameCount = 8;
const boomFrameWidth = 715 / 8; // 89.375
const boomFrameHeight = 105;

const stopFrameCount2 = 12;
const stopFrameWidth2 = 607 / 12; // 50.58...
const stopFrameHeight2 = 62;

const questionFrameCount = 6;
const questionFrameWidth = 283 / 6; // 47.16...
const questionFrameHeight = 46;

let currentFrame = 0;
let jumpFrame = 0;
let lightningFrame = 0;
let boomFrame = 0;

// 角色1的動畫狀態變數
let activeAnimation;
let currentAnimationLength;

// 角色2的狀態變數
let currentFrame2 = 0;
let questionFrame2 = 0;
let isChar2Questioning = false;
let hasChar2Triggered = false;
const triggerDistance = 100; // 觸發動畫的距離
let char2DialogueText = "";

// 對話與輸入系統的變數
let nameInput;
let playerName = "";
let dialogueState = 0; // 0: 無對話, 1: 正在詢問, 2: 已回答，顯示歡迎

let characterX, characterY;
let character2X, character2Y;
let originalY;
const characterSpeed = 5;
let isFacingLeft = false; // 追蹤角色方向
let isJumping = false;
let velocityY = 0;
const gravity = 0.6;
const jumpPower = -15;
let isLightning = false;
let isBooming = false;

function preload() {
  // 預先載入圖片精靈檔案
  stopSheet = loadImage('1/stop/stop.png');
  rollSheet = loadImage('1/roll/roll.png');
  jumpSheet = loadImage('1/jump/jump.png');
  lightningSheet = loadImage('1/lightning/lightning.png');
  boomSheet = loadImage('1/boom/boom.png');
  stopSheet2 = loadImage('2/stop/stop.png');
  questionSheet = loadImage('2/question/question.png');
}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置於畫布中央
  characterX = width / 2;
  characterY = height / 2;
  character2X = width / 2 - 150; // 將新角色放在左邊
  character2Y = height / 2;
  originalY = characterY;

  // 從 'stop.png' 圖片精靈中擷取每一個影格
  for (let i = 0; i < stopFrameCount; i++) {
    const x = Math.round(i * stopFrameWidth);
    const nextX = Math.round((i + 1) * stopFrameWidth);
    const w = nextX - x; // 51px
    let frame = stopSheet.get(x, 0, w, 51);
    stopAnimation.push(frame);
  }

  // --- 為 roll 動畫建立乾淨的圖片精靈 ---
  const cleanRollFrameWidth = 70;
  const cleanRollSheetWidth = cleanRollFrameWidth * rollFrameCount;
  let cleanRollSheet = createGraphics(cleanRollSheetWidth, rollFrameHeight);
  for (let i = 0; i < rollFrameCount; i++) {
    const sourceX = Math.floor(i * rollFrameWidth);
    const sourceW = Math.floor((i + 1) * rollFrameWidth) - sourceX;
    cleanRollSheet.image(rollSheet, i * cleanRollFrameWidth, 0, cleanRollFrameWidth, rollFrameHeight, sourceX, 0, sourceW, rollFrameHeight);
  }
  for (let i = 0; i < rollFrameCount; i++) {
    let frame = cleanRollSheet.get(i * cleanRollFrameWidth, 0, cleanRollFrameWidth, rollFrameHeight);
    rollAnimation.push(frame);
  }

  // --- 為 jump 動畫建立乾淨的圖片精靈 ---
  const cleanJumpFrameWidth = 56;
  const cleanJumpSheetWidth = cleanJumpFrameWidth * jumpFrameCount;
  let cleanJumpSheet = createGraphics(cleanJumpSheetWidth, jumpFrameHeight);
  for (let i = 0; i < jumpFrameCount; i++) {
    const sourceX = Math.floor(i * jumpFrameWidth);
    const sourceW = Math.floor((i + 1) * jumpFrameWidth) - sourceX;
    cleanJumpSheet.image(jumpSheet, i * cleanJumpFrameWidth, 0, cleanJumpFrameWidth, jumpFrameHeight, sourceX, 0, sourceW, jumpFrameHeight);
  }
  for (let i = 0; i < jumpFrameCount; i++) {
    let frame = cleanJumpSheet.get(i * cleanJumpFrameWidth, 0, cleanJumpFrameWidth, jumpFrameHeight);
    jumpAnimation.push(frame);
  }

  // --- 為 lightning 動畫建立乾淨的圖片精靈 ---
  const cleanLightningFrameWidth = 73;
  const cleanLightningSheetWidth = cleanLightningFrameWidth * lightningFrameCount;
  let cleanLightningSheet = createGraphics(cleanLightningSheetWidth, lightningFrameHeight);
  for (let i = 0; i < lightningFrameCount; i++) {
    const sourceX = Math.floor(i * lightningFrameWidth);
    const sourceW = Math.floor((i + 1) * lightningFrameWidth) - sourceX;
    cleanLightningSheet.image(lightningSheet, i * cleanLightningFrameWidth, 0, cleanLightningFrameWidth, lightningFrameHeight, sourceX, 0, sourceW, lightningFrameHeight);
  }
  for (let i = 0; i < lightningFrameCount; i++) {
    let frame = cleanLightningSheet.get(i * cleanLightningFrameWidth, 0, cleanLightningFrameWidth, lightningFrameHeight);
    lightningAnimation.push(frame);
  }

  // --- 為 boom 動畫建立乾淨的圖片精靈 ---
  const cleanBoomFrameWidth = 89;
  const cleanBoomSheetWidth = cleanBoomFrameWidth * boomFrameCount;
  let cleanBoomSheet = createGraphics(cleanBoomSheetWidth, boomFrameHeight);
  for (let i = 0; i < boomFrameCount; i++) {
    const sourceX = Math.floor(i * boomFrameWidth);
    const sourceW = Math.floor((i + 1) * boomFrameWidth) - sourceX;
    cleanBoomSheet.image(boomSheet, i * cleanBoomFrameWidth, 0, cleanBoomFrameWidth, boomFrameHeight, sourceX, 0, sourceW, boomFrameHeight);
  }
  for (let i = 0; i < boomFrameCount; i++) {
    let frame = cleanBoomSheet.get(i * cleanBoomFrameWidth, 0, cleanBoomFrameWidth, boomFrameHeight);
    boomAnimation.push(frame);
  }

  // --- 為 stop2 動畫建立乾淨的圖片精靈 ---
  const cleanStop2FrameWidth = 50;
  const cleanStop2SheetWidth = cleanStop2FrameWidth * stopFrameCount2;
  let cleanStop2Sheet = createGraphics(cleanStop2SheetWidth, stopFrameHeight2);
  for (let i = 0; i < stopFrameCount2; i++) {
    const sourceX = Math.floor(i * stopFrameWidth2);
    const sourceW = Math.floor((i + 1) * stopFrameWidth2) - sourceX;
    cleanStop2Sheet.image(stopSheet2, i * cleanStop2FrameWidth, 0, cleanStop2FrameWidth, stopFrameHeight2, sourceX, 0, sourceW, stopFrameHeight2);
  }
  for (let i = 0; i < stopFrameCount2; i++) {
    let frame = cleanStop2Sheet.get(i * cleanStop2FrameWidth, 0, cleanStop2FrameWidth, stopFrameHeight2);
    stopAnimation2.push(frame);
  }

  // --- 為 question 動畫建立乾淨的圖片精靈 ---
  const cleanQuestionFrameWidth = 47;
  const cleanQuestionSheetWidth = cleanQuestionFrameWidth * questionFrameCount;
  let cleanQuestionSheet = createGraphics(cleanQuestionSheetWidth, questionFrameHeight);
  for (let i = 0; i < questionFrameCount; i++) {
    const sourceX = Math.floor(i * questionFrameWidth);
    const sourceW = Math.floor((i + 1) * questionFrameWidth) - sourceX;
    cleanQuestionSheet.image(questionSheet, i * cleanQuestionFrameWidth, 0, cleanQuestionFrameWidth, questionFrameHeight, sourceX, 0, sourceW, questionFrameHeight);
  }
  for (let i = 0; i < questionFrameCount; i++) {
    let frame = cleanQuestionSheet.get(i * cleanQuestionFrameWidth, 0, cleanQuestionFrameWidth, questionFrameHeight);
    questionAnimation.push(frame);
  }


  // 將圖片的繪製模式設定為中心對齊
  imageMode(CENTER);

  // 建立文字輸入框並初始隱藏
  nameInput = createInput('');
  nameInput.hide();
  nameInput.style('font-size', '16px');
  nameInput.style('background-color', 'transparent');
  nameInput.style('border', 'none');
  nameInput.style('text-align', 'center');
  nameInput.style('outline', 'none'); // 移除點擊時的藍色外框
}

function draw() {
  // 設定背景顏色
  background('#90e0ef');

  let animationDirection = 1; // 1 代表正向播放, -1 代表反向

  // 檢查是否要觸發一次性動畫
  if (keyIsDown(UP_ARROW) && !isJumping && !isLightning && !isBooming) {
    isJumping = true;
    velocityY = jumpPower;
    jumpFrame = 0;
  }
  if (keyIsDown(DOWN_ARROW) && !isLightning && !isJumping && !isBooming) {
    isLightning = true;
    velocityY = jumpPower / 2; // 使用較小的力道
    lightningFrame = 0;
  }
  if (keyIsDown(32) && !isBooming && !isJumping && !isLightning) { // 32 是空白鍵
    isBooming = true;
    boomFrame = 0;
  }

  if (isJumping) {
    activeAnimation = jumpAnimation;
    currentAnimationLength = jumpFrameCount;
    characterY += velocityY;
    velocityY += gravity;

    // 當角色掉回或低於原始位置時，將其固定在原始位置
    if (characterY > originalY) {
      characterY = originalY;
      velocityY = 0;
    }

    // 更新並播放跳躍動畫
    if (frameCount % 8 === 0) { // 用較快的速度播放跳躍動畫
      jumpFrame++;
    }
    // 確保 currentFrame 不會超過動畫的最大索引
    currentFrame = min(jumpFrame, currentAnimationLength - 1);

    // 動畫結束且回到地面
    if (jumpFrame >= jumpFrameCount) {
      isJumping = false;
      characterY = originalY; // 重設回地面
      currentFrame = 0; // 重置影格，以便下一個動畫從頭開始
    }
  } else if (isLightning) {
    activeAnimation = lightningAnimation;
    currentAnimationLength = lightningFrameCount;
    characterY += velocityY;
    velocityY += gravity;

    // 更新並播放 lightning 動畫
    if (frameCount % 8 === 0) {
      lightningFrame++;
    }
    // 更新 currentFrame 以便繪製正確的影格
    currentFrame = min(lightningFrame, currentAnimationLength - 1); // 確保索引不超過範圍

    // 動畫結束且回到地面
    if (lightningFrame >= lightningFrameCount) { // 檢查動畫是否播放完畢
      isLightning = false;
      characterY = originalY; // 重設回地面
      currentFrame = 0; // 重置影格，以便下一個動畫從頭開始
    }
  } else if (isBooming) {
    activeAnimation = boomAnimation;
    currentAnimationLength = boomFrameCount;

    // 更新並播放 boom 動畫
    if (frameCount % 8 === 0) {
      boomFrame++;
    }
    // 確保 currentFrame 不會超過動畫的最大索引
    currentFrame = min(boomFrame, currentAnimationLength - 1);

    // 動畫結束且回到地面
    if (boomFrame >= boomFrameCount) {
      isBooming = false;
      characterY = height / 2; // 重設回地面
      currentFrame = 0; // 重置影格，以便下一個動畫從頭開始
    }
  } else {
    // 處理左右移動和站立
    if (keyIsDown(RIGHT_ARROW)) {
      activeAnimation = rollAnimation; // 向右滾動
      if (currentAnimationLength !== rollFrameCount) currentFrame = 0; // 從別的動畫切換來，就重置
      currentAnimationLength = rollFrameCount;
      characterX += characterSpeed;
      isFacingLeft = false;
      animationDirection = 1;
    } else if (keyIsDown(LEFT_ARROW)) {
      activeAnimation = rollAnimation; // 向左滾動
      if (currentAnimationLength !== rollFrameCount) currentFrame = 0; // 從別的動畫切換來，就重置
      currentAnimationLength = rollFrameCount;
      characterX -= characterSpeed;
      isFacingLeft = true;
      animationDirection = -1; // 反向播放滾動
    } else {
      activeAnimation = stopAnimation; // 根據最後方向站立
      if (currentAnimationLength !== stopFrameCount) currentFrame = 0; // 從別的動畫切換來，就重置
      currentAnimationLength = stopFrameCount;
    }

    if (frameCount % 12 === 0) {
      if (activeAnimation === rollAnimation) {
        currentFrame = (currentFrame + animationDirection + currentAnimationLength) % currentAnimationLength;
      } else {
        currentFrame = (currentFrame + 1) % currentAnimationLength; // 其他動畫一律正向播放
      }
    }
  }

  // 繪製角色
  push();
  translate(characterX, characterY);
  if (isFacingLeft) {
    scale(-1, 1); // 水平翻轉
  }
  image(activeAnimation[currentFrame], 0, 0);
  pop();

  // --- 角色1的對話框邏輯 ---
  if (dialogueState === 1) {
    push();
    translate(characterX, characterY);
    const boxWidth = 200;
    const boxHeight = 40;

    fill(255, 255, 255, 200); // 半透明白色背景
    stroke(0); // 黑色邊框
    rectMode(CENTER);
    rect(0, boxHeight, boxWidth, boxHeight, 10); // 在角色下方繪製圓角矩形

    // 將實際的輸入框定位到對話框內部
    nameInput.size(boxWidth - 20, boxHeight - 10);
    nameInput.position(characterX - nameInput.width / 2, characterY + boxHeight - nameInput.height / 2);
    
    // 新增提示文字
    textSize(12);
    text("(請按 Enter 送出)", 0, boxHeight + 25);
    pop();
  }

  // --- 角色2的邏輯 ---
  let distance = dist(characterX, characterY, character2X, character2Y);

  // 如果角色1靠近且動畫未被觸發過
  if (distance < triggerDistance && !hasChar2Triggered && dialogueState === 0) {
    isChar2Questioning = true;
    hasChar2Triggered = true; // 標記已觸發，避免重複播放
    questionFrame2 = 0; // 從頭播放
    dialogueState = 1; // 進入詢問狀態
    nameInput.value(''); // 清空輸入框
    nameInput.show(); // 顯示輸入框
    nameInput.elt.focus(); // 讓輸入框自動獲得焦點
  } else if (distance >= triggerDistance) {
    if (dialogueState !== 0) { // 如果正在對話但角色走遠了
      dialogueState = 0;
      isChar2Questioning = false;
      nameInput.hide();
    }
    hasChar2Triggered = false; // 角色遠離後，重置觸發器
  }

  let char2Animation;
  let char2CurrentFrame;

  if (isChar2Questioning) {
    // --- 動畫邏輯 ---
    char2Animation = questionAnimation;
    if (frameCount % 8 === 0) { // 用較快速度播放
      questionFrame2++;
    }
    char2CurrentFrame = min(questionFrame2, questionFrameCount - 1); // 確保索引不超過範圍

    if (questionFrame2 >= questionFrameCount) {
      // 如果還在詢問階段，動畫播完就停在最後一格
      if (dialogueState === 1) {
        questionFrame2 = questionFrameCount - 1;
      } else {
        // 如果已經回答完，則可以結束對話狀態
        isChar2Questioning = false;
        dialogueState = 0;
        questionFrame2 = 0; // 重置計數器
      }
    }
  } else {
    char2Animation = stopAnimation2;
    if (frameCount % 12 === 0) {
      currentFrame2 = (currentFrame2 + 1) % stopFrameCount2;
    }
    char2CurrentFrame = currentFrame2;
  }

  push();
  translate(character2X, character2Y);

  // 繪製角色2本身 (可翻轉)
  push();
  if (characterX < character2X) { // 如果角色1在角色2的左邊
    scale(-1, 1); // 水平翻轉
  }
  if (char2Animation[char2CurrentFrame]) { // 繪製前檢查影格是否存在
    image(char2Animation[char2CurrentFrame], 0, 0);
  }
  pop();

  // --- 對話框與輸入框邏輯 ---
  if (dialogueState === 1) {
    // 狀態1: 詢問名字
    char2DialogueText = "請問你叫甚麼名字";
  } else if (dialogueState === 2) {
    // 狀態2: 顯示歡迎訊息
    char2DialogueText = playerName + "，歡迎你！";
  }

  // 如果正在對話，則在角色2上方繪製對話框 (不翻轉)
  if (dialogueState === 1 || dialogueState === 2) {
    const boxWidth = 200;
    const boxHeight = 40;

    fill(255, 255, 255, 200); // 半透明白色背景
    stroke(0); // 黑色邊框
    rectMode(CENTER);
    rect(0, -boxHeight - 40, boxWidth, boxHeight, 10); // 在角色頭上繪製圓角矩形

    fill(0); // 黑色文字
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text(char2DialogueText, 0, -boxHeight - 40);
  }
  pop();
}

function keyPressed() {
  if (keyCode === ENTER && dialogueState === 1) {
    playerName = nameInput.value();
    nameInput.hide();
    dialogueState = 2; // 切換到歡迎狀態
    questionFrame2 = 0; // 重置動畫以便再次播放或切換
  }
}
