let tileSizeInput;
let tiles = [];
let font;
let input;
let updateButton;
let rotationPaused = false;
let saveButton;
let darkMode = false;

function preload() {
  font = loadFont("assets/favorit.ttf");
}

function setup() {
  frameRate(60);
  createCanvas(700, 700).id("myCanvas");
  document.getElementById("myCanvas").style.position = "absolute";
  document.getElementById("myCanvas").style.left = "0";
  document.getElementById("myCanvas").style.top = "0";

  input = createInput("pragmatica");
  input.position(1000, 480);
  input.class("input");

  tileSizeInput = createInput("50", "number");
  tileSizeInput.position(1220, 480);
  tileSizeInput.class("tileSizeInput");

  updateButton = createButton("Update Text & Tile Size");
  updateButton.position(1000, 550);
  updateButton.mousePressed(updateTextAndTileSize);
  updateButton.class("updateButton");

  saveButton = createButton("Save as PNG");
  saveButton.position(1000, 690);
  saveButton.mousePressed(saveImage);
  saveButton.class("saveButton");

  toggleColorButton = createButton("Toggle Color Scheme");
  toggleColorButton.position(1000, 620);
  toggleColorButton.mousePressed(toggleColorScheme);
  toggleColorButton.class("toggleColorButton");

  generateTextImage(input.value(), tileSizeInput.value());

  for (let y = 0; y < height; y += parseInt(tileSizeInput.value())) {
    for (let x = 0; x < width; x += parseInt(tileSizeInput.value())) {
      let tile = new Tile(x, y, parseInt(tileSizeInput.value()));
      tiles.push(tile);
    }
  }
  clear();
}

function draw() {
  let pg = createGraphics(width, height);
  if (darkMode) {
    pg.fill(255);
    pg.background(0);
  } else {
    pg.fill(0);
    pg.background(255);
  }
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].display();
  }
}

function mouseClicked() {
  rotationPaused = !rotationPaused;
}

function updateTextAndTileSize() {
  generateTextImage(input.value(), tileSizeInput.value());
}

function generateTextImage(inputText, tileSize, darkMode) {
  let pg = createGraphics(width, height);

  if (darkMode) {
    pg.background(255);
    pg.fill(0);
  } else {
    pg.background(0);
    pg.fill(255);
  }

  pg.textFont(font);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(120);
  pg.noStroke();
  pg.text(inputText, pg.width / 2, pg.height / 2 - 38);

  tiles = [];
  for (let y = 0; y < height; y += parseInt(tileSize)) {
    for (let x = 0; x < width; x += parseInt(tileSize)) {
      let tile = new Tile(x, y, parseInt(tileSize));
      tiles.push(tile);
    }
  }

  for (let i = 0; i < tiles.length; i++) {
    let x = tiles[i].x;
    let y = tiles[i].y;
    let w = tiles[i].w;
    tiles[i].img = pg.get(x, y, w, w);
  }
}

function saveImage() {
  saveCanvas("PG_shift", "png");
}

function toggleColorScheme() {
  darkMode = !darkMode;

  generateTextImage(input.value(), tileSizeInput.value(), darkMode);
}

class Tile {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.angle = 0;
    this.img = createImage(w, w);
  }

  display() {
    push();
    translate(this.x + this.w / 2, this.y + this.w / 2);
    if (!rotationPaused) {
      this.angle += 0.02;
    }
    rotate(this.angle);
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("PG_shift.gif", 10);
  }
}
