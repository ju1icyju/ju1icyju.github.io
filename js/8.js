let img;
let resolution = 6;
let useFirstVariation = true;
let resolutionInput;
let pauseMovement = false;
let savedRotationX, savedRotationY;

function setup() {
  frameRate(60);
  createCanvas(700, 700, WEBGL).id("myCanvas");
  document.getElementById("myCanvas").style.position = "absolute";
  document.getElementById("myCanvas").style.left = "0";
  document.getElementById("myCanvas").style.top = "0";

  let fileInput = createFileInput(handleFile);
  fileInput.position(1000, 450);
  fileInput.class("fileInput");

  resolutionInput = createInput(resolution.toString(), "number");
  resolutionInput.position(1200, 520);
  resolutionInput.attribute("min", "2");
  resolutionInput.attribute("max", "12");
  resolutionInput.class("resolutionInput");

  let switchButton = createButton("Switch reality");
  switchButton.position(1000, 520);
  switchButton.mousePressed(switchDrawingVariation);
  switchButton.class("switchButton");

  let downloadButton = createButton("Save as PNG");
  downloadButton.position(1000, 590);
  downloadButton.mousePressed(downloadImage);
  downloadButton.class("downloadButton");
}

function draw() {
  //background("black")
  clear();
  translate(-width / 32, -height / 32);

  if (!pauseMovement) {
    rotateY(map(mouseX, 0, width, -PI, PI));
    rotateX(map(mouseY, 0, height, -PI, PI));
  } else {
    rotateX(savedRotationX);
    rotateY(savedRotationY);
  }

  resolution = int(resolutionInput.value());

  if (img) {
    img.resize(width, height);
    translate(-img.width / 2, -img.height / 2, 0);
    img.loadPixels();

    for (let y = 0; y < img.height; y += resolution) {
      if (useFirstVariation) {
        beginShape();
        noFill();
        for (let x = 0; x < img.width; x += resolution) {
          let index1 = (x + y * img.width) * 4;
          let r = img.pixels[index1];
          let g = img.pixels[index1 + 1];
          let b = img.pixels[index1 + 2];
          let z = map((r + g + b) / 3, 0, 255, -50, 50);
          stroke(r, g, b);
          vertex(x, y, z);
        }
        endShape();
      } else {
        beginShape(TRIANGLE_STRIP);
        for (let x = 0; x < img.width; x += resolution) {
          let index1 = (x + y * img.width) * 4;
          let index2 = (x + (y + resolution) * img.width) * 4;
          let r = img.pixels[index1];
          let g = img.pixels[index1 + 1];
          let b = img.pixels[index1 + 2];
          let z = map((r + g + b) / 3, 0, 255, -100, 100);
          fill(r, g, b);
          noStroke();
          vertex(x, y, z);

          r = img.pixels[index2];
          g = img.pixels[index2 + 1];
          b = img.pixels[index2 + 2];
          z = map((r + g + b) / 3, 0, 255, -100, 100);
          fill(r, g, b);
          vertex(x, y + resolution, z);
        }
        endShape();
      }
    }

    img.updatePixels();
  }
}

function handleFile(file) {
  if (file.type === "image") {
    img = loadImage(file.data);
  } else {
    print("The selected file is not an image!");
  }
}

function switchDrawingVariation() {
  useFirstVariation = !useFirstVariation;
}

function mouseClicked() {
  if (pauseMovement) {
    savedRotationX = 0;
    savedRotationY = 0;
  } else {
    savedRotationX = map(mouseY, 0, height, -PI, PI);
    savedRotationY = map(mouseX, 0, width, -PI, PI);
  }
  pauseMovement = !pauseMovement;
}

function downloadImage() {
  saveCanvas("PG_shift", "png");
}

function keyPressed() {
  if (key === 's') {
    saveGif('PG_shift.gif', 20);
  }
}
