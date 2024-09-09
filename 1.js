let canvasSize = 700;
let grSize = canvasSize;
let pg;
let userInput;
let tilesXSlider, tilesYSlider;
let isPaused = false;
let darkMode = false;

function setup() {
  // Создаем холст p5.js и привязываем его к контейнеру с ID "myCanvas"
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('myCanvas'); // Привязываем холст к контейнеру с ID "myCanvas"

  frameRate(60);
  pg = createGraphics(grSize, grSize);

  // Инициализируем элементы управления
  userInput = select(".textField");
  tilesXSlider = select(".tilesXSlider");
  tilesYSlider = select(".tilesYSlider");

  let downloadButton = select(".downloadButton");
  downloadButton.mousePressed(downloadImage);

  let randomButton = select(".randomButton");
  randomButton.mousePressed(setRandomSyValue);

  let toggleColorButton = select(".toggleColorButton");
  toggleColorButton.mousePressed(toggleColorScheme);
}

function draw() {
  let tilesX = tilesXSlider.value();
  let tilesY = tilesYSlider.value();
  let inputText = userInput.value();

  console.log("Draw Function Called"); // Логирование при каждом вызове draw

  if (!isPaused) {
    if (darkMode) {
      background(255);
      pg.background(255);
      pg.fill(0);
    } else {
      background(0);
      pg.background(0);
      pg.fill(255);
    }

    pg.textFont("VERDANA");
    pg.textSize(canvasSize / 6);
    pg.push();
    pg.translate(grSize / 1, grSize / 1.6);
    pg.textAlign(CENTER, CENTER);
    pg.textLeading(canvasSize / 2);
    pg.text(inputText, -canvasSize / 2, -canvasSize / 6, 50);
    pg.pop();

    drawTiles(tilesX, tilesY);
  }
}

function setRandomSyValue() {
  let randomSyValue = Math.floor(random(1, 5));
  drawTiles(tilesXSlider.value(), tilesYSlider.value(), randomSyValue);
}

function downloadImage() {
  saveCanvas("PG_shift", "png");
}

function drawTiles(tilesX, tilesY, randomValue = 2) {
  let tileW = int(width / tilesX);
  let tileH = int(height / tilesY);

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      let wave = int(
        sin(frameCount * 0.05 + x * y * 0.05 + mouseX * 0.01) * 50
      );
      let sy = floor(y * tileH + wave * randomValue);

      let sx = floor(x * tileW + wave);
      let sw = tileW;
      let sh = tileH;
      let dx = x * tileW;
      let dy = y * tileH;
      let dw = tileW;
      let dh = tileH;



      copy(pg, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }
}

function toggleColorScheme() {
  darkMode = !darkMode;
}

function keyPressed() {
  if (key === 's') {
    saveGif('PG_shift.gif', 10);
  }
}
