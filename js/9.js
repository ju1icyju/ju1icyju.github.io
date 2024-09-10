let img;
let originalImg;
let prevFrames = [];
let isPaused = false;

let glass1Button, glass2Button;
let offsetSlider;
let replayButton;

function setup() {
  frameRate(60);
  createCanvas(700, 700).id("myCanvas");
  document.getElementById("myCanvas").style.position = "absolute";
  document.getElementById("myCanvas").style.left = "0";
  document.getElementById("myCanvas").style.top = "0";

  let fileInput = createFileInput(handleFile);
  fileInput.position(1000, 380);
  fileInput.class("fileInput");

  let downloadButton = createButton("Save as PNG");
  downloadButton.position(1000, 640);
  downloadButton.mousePressed(saveFrame);
  downloadButton.class("downloadButton");

  glass1Button = createButton("Glass 1");
  glass1Button.position(1000, 450);
  glass1Button.mousePressed(switchToGlass1);
  glass1Button.class("glass1Button");

  glass2Button = createButton("Glass 2");
  glass2Button.position(1150, 450);
  glass2Button.mousePressed(switchToGlass2);
  glass2Button.class("glass2Button");

  offsetSlider = createSlider(1, 7, 5);
  offsetSlider.position(1000, 520);
  offsetSlider.class("offsetSlider");

  replayButton = createButton("Replay");
  replayButton.position(1000, 570);
  replayButton.mousePressed(resetToOriginalImage);
  replayButton.class("replayButton");
}

function draw() {
  clear();

  if (img) {
    if (!isPaused) {
      let newFrame = createImage(width, height);
      newFrame.copy(
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
      prevFrames.push(newFrame);

      if (prevFrames.length > 10) {
        prevFrames.splice(0, 1);
      }

      let dx = mouseX - pmouseX;
      let dy = mouseY - pmouseY;

      img.loadPixels();
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          let loc = (x + y * img.width) * 4;

          let offset, newLoc;

          if (glass1Button.active) {
            offset = int(sin(y / offsetSlider.value()) * offsetSlider.value());
          } else if (glass2Button.active) {
            offset = int(
              sin(y / (offsetSlider.value() * 2)) * (offsetSlider.value() * 2)
            );
          }

          newLoc = (x + (y + offset) * img.width) * 4;

          if (newLoc >= 0 && newLoc < img.pixels.length) {
            img.pixels[loc] = img.pixels[newLoc];
            img.pixels[loc + 1] = img.pixels[newLoc + 1];
            img.pixels[loc + 2] = img.pixels[newLoc + 2];
          }
        }
      }
      img.updatePixels();
    }

    tint(255, 200);
    for (let i = 0; i < prevFrames.length; i++) {
      image(prevFrames[i], 0, 0, width, height);
    }
  }
}

function handleFile(file) {
  if (file.type === "image") {
    img = loadImage(file.data, (img) => {
      let aspectRatio = img.width / img.height;
      if (aspectRatio > 1) {
        img.resize(width, 0);
      } else {
        img.resize(0, height);
      }
      originalImg = createImage(img.width, img.height);
      originalImg.copy(
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
    });
  } else {
    print("The selected file is not an image!");
  }
}

function saveFrame() {
  saveCanvas("PG_shift", "png");
}

function mouseClicked() {
  isPaused = !isPaused;
}

function switchToGlass1() {
  glass1Button.active = true;
  glass2Button.active = false;
}

function switchToGlass2() {
  glass1Button.active = false;
  glass2Button.active = true;
}

function resetToOriginalImage() {
  if (originalImg) {
    img.copy(
      originalImg,
      0,
      0,
      originalImg.width,
      originalImg.height,
      0,
      0,
      originalImg.width,
      originalImg.height
    );
    prevFrames = [];
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("PG_shift.gif", 10);
  }
}
