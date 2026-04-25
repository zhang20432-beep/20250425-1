// 全域變數
let shapes = [];
let bubbles = [];
let song;
let amplitude;
let songLoaded = false;

// 外部定義的頂點座標，用於生成多邊形
let points = [[-3, 5], [3, 7], [1, 5], [2, 4], [4, 3], [5, 2], [6, 2], [8, 4], [8, -1], [6, 0], [0, -3], [2, -6], [-2, -3], [-4, -2], [-5, -1], [-6, 1], [-6, 2]];

// 水泡類別（從底部往上跑，抵達指定高度時破裂）
class Bubble {
  constructor() {
    this.reset();
    this.popped = false;
    this.popRadius = 0;
    this.popAlpha = 180;
  }

  reset() {
    this.x = random(0, windowWidth);
    this.y = windowHeight + random(20, 100);
    // 使水泡更小一些
    this.r = random(6, 14);
    this.vy = random(0.8, 2.5);
    this.popY = random(windowHeight * 0.25, windowHeight * 0.7);
    this.popped = false;
    this.popRadius = 0;
    this.popAlpha = 180;
  }

  update() {
    if (this.popped) {
      this.popRadius += 1.5;
      this.popAlpha -= 6;
      if (this.popAlpha <= 0) {
        this.reset();
      }
      return;
    }

    this.y -= this.vy;

    // 到達 popY 後開始破掉
    if (this.y < this.popY) {
      this.popped = true;
    }
  }

  draw() {
    noStroke();

    if (this.popped) {
      // 破掉特效：擴散光暈
      fill(255, this.popAlpha);
      ellipse(this.x, this.y, this.popRadius * 2);

      // 破掉碎片
      stroke(255, this.popAlpha);
      strokeWeight(2);
      for (let i = 0; i < 6; i++) {
        const angle = (TWO_PI / 6) * i;
        const px = this.x + cos(angle) * this.popRadius;
        const py = this.y + sin(angle) * this.popRadius;
        line(this.x, this.y, px, py);
      }

      return;
    }

    // 未破掉：繪製透明水泡
    fill(255, 180);
    stroke(255, 200);
    strokeWeight(2);
    ellipse(this.x, this.y, this.r * 2);

    // 水泡高光
    noStroke();
    fill(255, 220);
    const highlightSize = this.r * 0.6;
    ellipse(this.x - this.r * 0.25, this.y - this.r * 0.2, highlightSize, highlightSize * 0.6);
  }
}

function preload() {
  // 在程式開始前預載入音樂檔案
  // 如果檔案不存在，會在錯誤回呼中提示。
  song = loadSound(
    'midnight-quirk-255361.mp3',
    () => {
      songLoaded = true;
    },
    (err) => {
      console.warn('無法載入音檔，請確認 mp3 檔案存在於專案根目錄：', err);
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 初始化音量分析器
  amplitude = new p5.Amplitude();

  // 產生並儲存多個形狀物件
  for (let i = 0; i < 10; i++) {
    const shape = {
      x: random(0, windowWidth),
      y: random(0, windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      scale: random(10, 14),
      color: color(random(255), random(255), random(255)),
      // 不改變原始 points 的形狀，只在繪製時用 scale 變大
      points: points.map((p) => [p[0], p[1]]),
    };

    shapes.push(shape);
  }

  // 產生一些由下往上的水泡
  for (let i = 0; i < 20; i++) {
    bubbles.push(new Bubble());
  }

  // 嘗試自動循環播放音樂（在某些瀏覽器可能需要使用者互動）
  if (songLoaded && song && !song.isPlaying()) {
    song.loop();
  } else if (!songLoaded) {
    console.warn('音樂尚未載入，請確認音檔存在於專案根目錄。');
  }
}

function draw() {
  background('#ffcdb2');
  strokeWeight(2);

  // 取得目前音量
  const level = amplitude.getLevel();
  const sizeFactor = map(level, 0, 1, 0.5, 2);

  // 更新並繪製水泡
  for (const bubble of bubbles) {
    bubble.update();
    bubble.draw();
  }

  for (const shape of shapes) {
    // 更新位置
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊界反彈
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    fill(shape.color);
    stroke(shape.color);

    push();
    translate(shape.x, shape.y);

    // 上下翻轉（Y 反向），並在向右移動時左右翻轉
    const xScale = (shape.dx > 0 ? -1 : 1) * sizeFactor * shape.scale;
    const yScale = -sizeFactor * shape.scale;
    scale(xScale, yScale);

    beginShape();
    for (const pt of shape.points) {
      vertex(pt[0], pt[1]);
    }
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 更新水泡的範圍，讓它們不會消失在舊畫布外
  for (const bubble of bubbles) {
    if (bubble.y > windowHeight + 100) {
      bubble.reset();
    }
  }
}

function mousePressed() {
  // 瀏覽器需要使用者互動才允許啟動 AudioContext
  if (getAudioContext && getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  // 使用滑鼠作為播放/暫停開關
  if (songLoaded && song) {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.loop();
    }
  }
}
