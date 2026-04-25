function setup() {
  // Create a full-window canvas and set a light background color.
  createCanvas(windowWidth, windowHeight);
  background("#f5e6e8");
}

function draw() {
  // Draw a peach-colored circle at the center of the canvas.
  fill("#fec89a");
  ellipse(width / 2, height / 2, 200, 200);
  //在圓的內部，圓心的左上角與右上角各畫一個方框，方框的顏色為b3dee2，邊長為20。
  fill("#b3dee2");
//設定方框的參考點為中心點
  rectMode(CENTER);
  rect(width / 2 - 50, height / 2 - 50, 20, 20);
  rect(width / 2 + 50, height / 2 - 50, 20, 20);
  //在圓心內畫一個圓弧，當作笑臉的嘴巴，圓弧的顏色為b3dee2，寬度為8，起始角度為0，結束角度為PI。
  noFill();
  stroke("#b3dee2");
  strokeWeight(8);
  arc(width / 2, height / 2 + 20, 100, 50, 0, PI);
}
