let img;
let originalImg;
let prevFrame;
let isPaused;
let dxOffset, dyOffset;

function setup() {
  frameRate(60);
  createCanvas(700, 700).id("myCanvas");
  document.getElementById("myCanvas").style.position = "absolute";
  document.getElementById("myCanvas").style.left = "0";
  document.getElementById("myCanvas").style.top = "0";

  let fileInput = createFileInput(handleFile);
  fileInput.position(1000, 420);
  fileInput.class("fileInput");

  let downloadButton = createButton("Save as PNG");
  downloadButton.position(1000, 560);
  downloadButton.mousePressed(downloadImage);
  downloadButton.class("downloadButton");

  let retryButton = createButton("Retry");
  retryButton.position(1000, 490);
  retryButton.mousePressed(retry);
  retryButton.class("retryButton");

  prevFrame = createImage(width, height);
  isPaused = false;
  dxOffset = 0;
  dyOffset = 0;
}

function draw() {
  background(255);

  if (img) {
    if (prevFrame.width !== img.width || prevFrame.height !== img.height) {
      img.resize(width, height);
      prevFrame = img.get();
    }

    let dx = mouseX - pmouseX + dxOffset;
    let dy = mouseY - pmouseY + dyOffset;

    if (!isPaused) {
      prevFrame.copy(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        img.width,
        img.height
      );
      img.copy(
        prevFrame,
        0,
        0,
        prevFrame.width,
        prevFrame.height,
        dx,
        dy,
        prevFrame.width,
        prevFrame.height
      );
    }

    image(prevFrame, 0, 0, width, height);
  }
}

function handleFile(file) {
  if (file.type === "image") {
    originalImg = loadImage(file.data);
    img = loadImage(file.data);
    resetAdjustments();
  } else {
    print("The selected file is not an image!");
  }
}

function mouseClicked() {
  if (isPaused) {
    dxOffset = 0;
    dyOffset = 0;
  }
  isPaused = !isPaused;
}

function downloadImage() {
  let tempCanvas = createGraphics(700, 700);
  tempCanvas.image(prevFrame, 0, 0, 700, 700);

  tempCanvas.save("PG_shift.png");
}

function retry() {
  if (originalImg) {
    img = originalImg.get();
    resetAdjustments();
  }
}

function resetAdjustments() {
  isPaused = false;
  dxOffset = 0;
  dyOffset = 0;
}

function keyPressed() {
  if (key === "s") {
    saveGif("PG_shift.gif", 20);
  }
}
