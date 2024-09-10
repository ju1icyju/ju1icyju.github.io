let img;
let cx;
let cy;
let innerRadius;
let outerRadius;
let startX;
let startY;
let endX;
let endY;
let deltaSlice;
let limitSlider;
let angleInput;

function setup() {
  createCanvas(700, 700).id("myCanvas");
  document.getElementById("myCanvas").style.position = "absolute";
  document.getElementById("myCanvas").style.left = "0";
  document.getElementById("myCanvas").style.top = "0";

  let fileInput = createFileInput(handleFile);
  fileInput.parent("upload-button");
  fileInput.class("fileInput");
  fileInput.position(1000, 380);
  clear();
  deltaSlice = 1;

  noLoop();

  cx = width / 2;
  cy = height / 2;
  innerRadius = 0;
  outerRadius = 200;
  startX = 0;
  startY = 0;
  endX = 300;
  endY = 300;

  limitSlider = createSlider(2, 10, 2);
  limitSlider.position(1200, 450);
  limitSlider.input(redrawCanvas);
  limitSlider.class("limitSlider");

  angleInput = createInput("1", "number");
  angleInput.attribute("min", "1");
  angleInput.attribute("max", "6");
  angleInput.position(1000, 450);
  angleInput.input(redrawCanvas);
  angleInput.class("angleInput");

  let downloadButton = createButton("Save as PNG");
  downloadButton.position(1000, 520);
  downloadButton.parent("upload-button");
  downloadButton.mousePressed(downloadImage);
  downloadButton.class("downloadButton");
}

function handleFile(file) {
  if (file.type === "image") {
    img = loadImage(file.data, () => {
      img.resize(300, 300);
      redraw();
    });
  }
}

function draw() {
  if (img) {
    let angle = 0;
    let step = angleInput.value() * atan2(1, outerRadius);
    let limit = limitSlider.value() * PI;

    push();
    translate(cx, cy);
    rotate(-PI / 2.0);

    while (angle < limit) {
      rotate(step);
      angle += step;

      let ratio = angle / limit;
      let x = ratio * img.width;
      image(img, 0, 0, deltaSlice, outerRadius, x, 0, deltaSlice, height);
    }

    pop();
  }
}

function downloadImage() {
  saveCanvas("PG_shift", "png");
}

function redrawCanvas() {
  redraw();
}
