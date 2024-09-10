let img;
let colCount, rowCount;
let amp = 200;
let isPaused = false;
let saveImage = false;

function setup() {
  // Создаем холст p5.js и привязываем его к контейнеру с ID "myCanvas"
  createCanvas(700, 700).parent('myCanvas');

  // Инициализируем элементы управления
  let fileInput = select('#uploadButton');
  fileInput.elt.addEventListener('change', (event) => {
    handleFile(event.target.files[0]);
  });

  let downloadButton = createButton("Save as PNG");
  downloadButton.position(1000, 540);
  downloadButton.mousePressed(saveImg);
  downloadButton.class("downloadButton");

  let retryButton = createButton("Retry");
  retryButton.position(1000, 470);
  retryButton.mousePressed(randomizeCounts);
  retryButton.class("retryButton");

  strokeWeight(10);
  strokeCap(SQUARE);
}

function handleFile(file) {
  console.log("Handling file upload...");
  console.log("File details:", file);

  if (file && file.type && file.type.startsWith('image')) {
    console.log("File is an image. Loading image...");
    
    let reader = new FileReader();
    reader.onload = (event) => {
      let url = event.target.result;
      img = loadImage(url, () => {
        img.resize(1600, 900);
        randomizeCounts();
        console.log("Image loaded and resized.");
      });
    };
    reader.readAsDataURL(file);
  } else {
    console.log("Not an image file. File type:", file ? file.type : "undefined");
  }
}

function randomizeCounts() {
  colCount = floor(random(5, 25));
  rowCount = floor(random(5, 25));
  console.log("Randomized counts: colCount =", colCount, ", rowCount =", rowCount);
}

function draw() {
  if (!isPaused && img) {
    background(255, 10);
    clear();
    for (let j = 0; j < rowCount; j++) {
      for (let i = 0; i < colCount; i++) {
        let nx = noise(i / 20, j / 10, frameCount / 50 + 999) * 2 - 1;
        let ny = noise(i / 20, j / 10, frameCount / 50) * 2 - 1;

        let destW = width / colCount;
        let destH = height / rowCount;
        let destX = destW * i;
        let destY = destH * j;
        let srcW = img.width / colCount;
        let srcH = img.height / rowCount;
        let srcX = srcW * i + nx * amp;
        let srcY = srcH * j + ny * amp;
        image(img, destX, destY, destW, destH, srcX, srcY, srcW, srcH);
      }
    }
  } else if (saveImage) {
    save("output.png");
    saveImage = false;
  }
}

function mouseClicked() {
  isPaused = !isPaused;
  console.log("Toggled pause state:", isPaused);
}

function saveImg() {
  save("PG_shift.png");
  console.log("Image saved as PG_shift.png");
}

function keyPressed() {
  if (key === 's') {
    saveGif('PG_shift.gif', 10);
    console.log("Saving GIF as PG_shift.gif");
  }
}
