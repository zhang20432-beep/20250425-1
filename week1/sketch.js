/**
 * p5_audio_visualizer
 * 這是一個結合 p5.js 與 p5.sound 的程式，載入音樂並循環播放，
 * 畫面上會有多個隨機生成的多邊形在視窗內移動反彈，
 * 且其大小會跟隨音樂的振幅（音量）即時縮放。
 */

// 全域變數
let shapes = [];
let song;
let amplitude;
// 外部定義的二維陣列，做為多邊形頂點的基礎座標
let points = [
  [-2, -4],
  [2, -4],
  [4, 0],
  [2, 4],
  [-2, 4],
  [-4, 0]
];

function preload() {
  // 使用 loadSound() 載入音檔並將其賦值給全域變數 song
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  // 使用 createCanvas(windowWidth, windowHeight) 建立符合視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 將變數 amplitude 初始化為 new p5.Amplitude()
  amplitude = new p5.Amplitude();

  // 使用 for 迴圈產生 10 個形狀物件，並 push 到 shapes 陣列中
  for (let i = 0; i < 10; i++) {
    // 透過 map() 讀取全域陣列 points，將每個頂點的 x 與 y 分別乘上 10 到 30 之間的隨機倍率來產生變形
    let deformedPoints = points.map(pt => {
      return [
        pt[0] * random(10, 30),
        pt[1] * random(10, 30)
      ];
    });

    let shape = {
      x: random(0, windowWidth), // 0 到 windowWidth 之間的隨機亂數
      y: random(0, windowHeight), // 0 到 windowHeight 之間的隨機亂數
      dx: random(-3, 3), // -3 到 3 之間的隨機亂數
      dy: random(-3, 3), // -3 到 3 之間的隨機亂數
      scale: random(1, 10), // 1 到 10 之間的隨機亂數
      color: color(random(255), random(255), random(255)), // 隨機生成的 RGB 顏色
      points: deformedPoints
    };

    shapes.push(shape);
  }
}

function draw() {
  // 設定背景顏色為 '#ffcdb2'
  background('#ffcdb2');
  
  // 設定邊框粗細 strokeWeight(2)
  strokeWeight(2);

  // 透過 amplitude.getLevel() 取得當前音量大小（數值介於 0 到 1）
  let level = amplitude.getLevel();

  // 使用 map() 函式將 level 從 (0, 1) 的範圍映射到 (0.5, 2) 的範圍
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 使用 for...of 迴圈走訪 shapes 陣列中的每個 shape 進行更新與繪製
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y); // 將原點移動到形狀座標
    scale(sizeFactor); // 依照音樂音量縮放圖形

    // 繪製多邊形
    beginShape();
    for (let pt of shape.points) {
      vertex(pt[0], pt[1]);
    }
    endShape(CLOSE);

    // 狀態還原
    pop();
  }
}

// 額外功能：點擊滑鼠控制播放/暫停 (解決瀏覽器自動播放策略問題)
function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}

// 額外功能：視窗大小改變時調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
