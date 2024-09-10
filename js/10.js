let img;
let fileInput;
let useOption1 = true;
let rangeInput;
let pixelSizeSlider;

function setup() {
  createCanvas(700, 700).id("myCanvas");
  document.getElementById("myCanvas").style.position = "absolute";
  document.getElementById("myCanvas").style.left = "0";
  document.getElementById("myCanvas").style.top = "0";

  fileInput = createFileInput(handleFile);
  fileInput.position(1000, 430);
  fileInput.class("fileInput");

  rangeInput = createInput("50", "number");
  rangeInput.position(1200, 570);
  rangeInput.input(updateSort);
  rangeInput.class("rangeInput");

  pixelSizeSlider = createSlider(1, 20, 5, 1);
  pixelSizeSlider.position(1000, 570);
  pixelSizeSlider.style("width", "150px");
  pixelSizeSlider.input(updateSort);

  let switchButton1 = createButton("Use Option 1");
  switchButton1.position(1000, 500);
  switchButton1.class("switchButton1");
  switchButton1.mousePressed(() => {
    useOption1 = true;
    if (img) {
      sortPixels();
    }
  });

  let switchButton2 = createButton("Use Option 2");
  switchButton2.position(1200, 500);
  switchButton2.class("switchButton2");
  switchButton2.mousePressed(() => {
    useOption1 = false;
    if (img) {
      sortPixels();
    }
  });

  let downloadButton = createButton("Save as PNG");
  downloadButton.position(1000, 640);
  downloadButton.mousePressed(downloadImage);
  downloadButton.class("downloadButton")
}

function handleFile(file) {
  if (file.type === "image") {
    img = loadImage(file.data, () => {
      img.resize(width, height);
      //noSmooth();
      image(img, 0, 0);
      if (useOption1 || typeof useOption1 == "boolean") {
        sortPixels();
      }
    });
  } else {
    console.log("Please choose an image file.");
  }
}

function sortPixels() {
  loadPixels();
  let maxRange = rangeInput.value();
  let sizeStep = pixelSizeSlider.value();

  for (let y = 0; y < height; y += 1) {
    const range = getPixelRange(y, maxRange);
    for (let x = 0; x < width; x += 1) {
      const leftX = constrain(x - range, 0, width);
      const rightX = constrain(x + range, 0, width);
      let sampleX = random(leftX, rightX);

      const topY = constrain(y - range, 0, height);
      const bottomY = constrain(y + range, 0, height);
      let sampleY = random(topY, bottomY);

      if (useOption1) {
        const pixelColor = img.get(sampleY, sampleX);
        set(y, x, pixelColor);
      } else {
        const pixelColor = img.get(sampleX, sampleY);
        set(x, y, pixelColor);
      }
    }
  }
  updatePixels();
}

function getPixelRange(y, maxRange) {
  return map(pow(y, 3), 0, pow(height, 3), 0, maxRange);
}

function updateSort() {
  sortPixels();
}

function downloadImage() {
  saveCanvas("PG_shift", "png");
}
