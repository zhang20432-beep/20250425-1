let gameState = "HOME"; // 遊戲狀態：HOME, SCENE, TASK, RESULT
let isCorrect = false; // 紀錄答案是否正確
let activeClue = ""; // 紀錄目前正在進行的線索：CAMERA 或 FOOTPRINT
let bgImg; // 儲存背景圖片

function preload() {
  // 這裡使用一張高品質的博物館室內圖片
  bgImg = loadImage('https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=2000&auto=format&fit=crop');
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 使用視窗的寬度和高度
  textAlign(CENTER, CENTER);
  imageMode(CORNER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時，重新調整畫布大小
}

function draw() {
  background(220);

  if (gameState === "HOME") {
    drawHome();
  } else if (gameState === "SCENE") {
    drawScene();
  } else if (gameState === "QUIZ") {
    drawQuiz();
  } else if (gameState === "RESULT") {
    drawResult();
  }
}

function drawHome() {
  // 首頁也使用背景圖，並加上半透明遮罩
  image(bgImg, 0, 0, width, height);
  fill(255, 200); // 白色半透明背景讓文字好讀
  rect(width/2, height/2, width, height);

  fill(0);
  textSize(32);
  text("博物館失竊事件", width / 2, height / 2 - 40);
  
  // 開始按鈕
  fill(100, 200, 100);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 40, 120, 40, 10);
  fill(255);
  textSize(18);
  text("開始調查", width / 2, height / 2 + 40);
}

function drawScene() {
  // 背景改為真正的圖片
  image(bgImg, 0, 0, width, height);
  
  // 畫作示意
  fill(200, 150, 100, 200);
  rect(50, 100, 100, 150); // 一幅畫的示意
  
  // 監視器（線索物件）
  fill(50);
  ellipse(width - 60, 60, 50, 50);
  fill(255, 0, 0);
  circle(width - 60, 60, 10); // 監視器紅點
  
  fill(0);
  textSize(20);
  text("點擊監視器查看錄影", width / 2, height - 30);
  textSize(30);
  text("📹", width - 60, 65);

  // 腳印（線索物件）
  let dFoot = dist(mouseX, mouseY, width / 2, height - 150);
  
  push(); // 開始獨立樣式設定
  if (dFoot < 60) {
    // 滑鼠靠近時的發光效果
    drawingContext.shadowBlur = 30; // 發光強度
    drawingContext.shadowColor = 'yellow'; // 光芒顏色
    fill(255, 255, 0); // 腳印顏色變亮
    textSize(32); // 稍微放大
    cursor(HAND); // 變成手型指標
  } else {
    fill(255, 180); // 平時是淡白色
    textSize(24);
    cursor(ARROW);
  }
  text("👣", width / 2, height - 150);
  pop(); // 結束發光樣式

  textSize(16);
  fill(255);
  text("查看地上的腳印", width / 2, height - 110);

  // --- 放大鏡特效實作 ---
  let magnifierSize = 160; // 放大鏡的大小
  let zoomFactor = 2;      // 放大倍率

  // 1. 抓取滑鼠周圍的畫面 (抓取的範圍較小，之後會放大顯示)
  // 注意：get() 會抓取目前畫面上已經畫出來的東西
  let snippet = get(
    mouseX - (magnifierSize / zoomFactor) / 2,
    mouseY - (magnifierSize / zoomFactor) / 2,
    magnifierSize / zoomFactor,
    magnifierSize / zoomFactor
  );

  push();
  // 繪製放大鏡的銀色金屬外框
  stroke(200);
  strokeWeight(5);
  noFill();
  circle(mouseX, mouseY, magnifierSize);

  // 2. 設定圓形遮罩，只在放大鏡圈圈內顯示放大後的內容
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(mouseX, mouseY, magnifierSize / 2, 0, TWO_PI);
  drawingContext.clip();

  // 3. 繪製抓取到的局部畫面，並將其展開到放大鏡的大小
  imageMode(CENTER);
  image(snippet, mouseX, mouseY, magnifierSize, magnifierSize);
  
  drawingContext.restore();
  pop();
}

function drawQuiz() {
  background(240);
  fill(0);
  textSize(24);
  text("監視器線索：", width / 2, height / 2 - 180);
  textSize(20);
  fill(100, 0, 0);

  // 根據點擊的物件顯示不同線索
  if (activeClue === "CAMERA") {
    text("\"The suspect left after everyone else.\"", width / 2, height / 2 - 140);
  } else if (activeClue === "FOOTPRINT") {
    text("\"腳印尺寸為 45 號，且帶有泥土。\"", width / 2, height / 2 - 140);
  }

  fill(0);
  textSize(26);
  text("根據線索，誰最符合嫌疑人特徵？", width / 2, height / 2 - 80);
  
  // 選項按鈕
  rectMode(CENTER);
  fill(200);
  rect(width / 2, height / 2, 250, 45, 5);
  rect(width / 2, height / 2 + 60, 250, 45, 5);
  rect(width / 2, height / 2 + 120, 250, 45, 5);
  
  fill(0);
  textSize(20);
  if (activeClue === "CAMERA") {
    text("A. 策展人", width / 2, height / 2);
    text("B. 維修人員", width / 2, height / 2 + 60);
    text("C. 實習生", width / 2, height / 2 + 120);
  } else {
    text("A. 搬運工", width / 2, height / 2);
    text("B. 櫃檯小姐", width / 2, height / 2 + 60);
    text("C. 導覽員", width / 2, height / 2 + 120);
  }
}

function drawResult() {
  if (isCorrect) {
    background(220, 255, 220); // 正確顯示綠色背景
    fill(0, 150, 0);
    textSize(40);
    text("✔ 正確", width / 2, height / 2 - 100);
  } else {
    background(255, 220, 220); // 錯誤顯示紅色背景
    fill(200, 0, 0);
    textSize(40);
    text("❌ 錯誤", width / 2, height / 2 - 100);
  }

  fill(0);
  textSize(22);
  text("案件解釋：", width / 2, height / 2 - 20);
  textSize(18);
  let explanation = "";
  if (isCorrect) {
    explanation = activeClue === "CAMERA" 
      ? "維修人員可以自由進出各個展廳，\n且通常在閉館後進行工作，最晚離開。" 
      : "搬運工平時穿著重型工作靴 (45 號)，\n且剛從帶有泥土的後院運送貨物進來。";
  } else {
    explanation = "這似乎不是正確答案，請再觀察一次線索。";
  }
  text(explanation, width / 2, height / 2 + 30);

  // 重新開始按鈕
  fill(100, 150, 255);
  rect(width / 2, height / 2 + 130, 120, 40, 10); // 將按鈕移到 +130 與文字對齊
  fill(255);
  textSize(18);
  text("重新挑戰", width / 2, height / 2 + 130);
}

function mousePressed() {
  if (gameState === "HOME") {
    // 開始按鈕偵測：原本中心在 width/2, height/2 + 40，寬120 高40
    if (mouseX > width/2 - 60 && mouseX < width/2 + 60 && mouseY > height/2 + 20 && mouseY < height/2 + 60) {
      gameState = "SCENE";
    }
  } else if (gameState === "SCENE") {
    // 點擊監視器
    let dCamera = dist(mouseX, mouseY, width - 60, 60);
    if (dCamera < 30) {
      activeClue = "CAMERA";
      gameState = "QUIZ";
    }
    // 點擊腳印 (位置在 width/2, height-150 左右)
    let dFoot = dist(mouseX, mouseY, width / 2, height - 150);
    if (dFoot < 30) {
      activeClue = "FOOTPRINT";
      gameState = "QUIZ";
    }
  } else if (gameState === "QUIZ") {
    // 選項偵測
    if (mouseX > width/2 - 125 && mouseX < width/2 + 125) {
      if (mouseY > height/2 - 22 && mouseY < height/2 + 22) { // A
        // 如果是腳印線索，A 是正確的；如果是監視器，A 是錯誤的
        isCorrect = activeClue === "FOOTPRINT";
        gameState = "RESULT";
      } else if (mouseY > height/2 + 38 && mouseY < height/2 + 82) { // B (正確)
        // 如果是監視器線索，B 是正確的
        isCorrect = activeClue === "CAMERA";
        gameState = "RESULT";
      } else if (mouseY > height/2 + 98 && mouseY < height/2 + 142) { // C
        isCorrect = false;
        gameState = "RESULT";
      }
    }
  } else if (gameState === "RESULT") {
    // 重新開始按鈕偵測：中心在 width/2, height/2 + 130
    if (mouseX > width/2 - 60 && mouseX < width/2 + 60 && mouseY > height/2 + 110 && mouseY < height/2 + 150) {
      gameState = "HOME"; // 修正：點擊後應回到首頁
    }
  }
}
