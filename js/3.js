let img;
let trail = [];
let directionVariation = 1;

// Функция preload для создания кнопок загрузки
function preload() {
  // Здесь мы создаем кнопку загрузки и позиционируем ее
  let uploadButton = createFileInput(handleFile);
  uploadButton.position(1000, 470);
  uploadButton.class("fileInputButton");
}

// Функция для обработки файла
function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      img.resize(700, 700);
      console.log("Image loaded and resized");
    });
  } else {
    console.log("The file selected is not an image");
  }
}

function setup() {
  frameRate(60);
  createCanvas(700, 700).id("myCanvas");
  document.getElementById("myCanvas").style.position = "absolute";
  document.getElementById("myCanvas").style.left = "0";
  document.getElementById("myCanvas").style.top = "0";
  background("white");

  // Инициализация кнопок
  const saveButton = select('.downloadButton');
  const colorButton = select('.toggleColorButton');
  const randomButton = select('.randomButton');
  const clearButton = select('.clearButton');

  if (saveButton) saveButton.mousePressed(saveImage);
  if (colorButton) colorButton.mousePressed(changeColor);
  if (randomButton) randomButton.mousePressed(randomize);
  if (clearButton) clearButton.mousePressed(clearCanvas);
}

function draw() {
  if (mouseIsPressed) {
    let copyImg = createImage(200, 200);
    let x = mouseX - 25;
    let y = mouseY - 25;
    if (x >= 0 && y >= 0 && x + 50 <= width && y + 50 <= height) {
      if (img) {
        copyImg.copy(img, x, y, 50, 50, 0, 0, 50, 50);
        copyImg.mask(img);

        trail.push({
          image: copyImg,
          x: x,
          y: y,
          direction: getRandomDirection(directionVariation),
        });

        if (trail.length > 25) {
          trail.splice(0, 1);
        }

        for (let i = 0; i < trail.length; i++) {
          let xPos = trail[i].x + i * 2 * trail[i].direction;
          let yPos = trail[i].y + i * 2 * trail[i].direction;
          image(trail[i].image, xPos, yPos);
        }
      }
    }
  }
}

function saveImage() {
  saveCanvas("PG_shift", "png");
}

function changeColor() {
  // Логика для изменения цвета
  console.log("Color button pressed");
}

function randomize() {
  // Логика для случайного изменения
  console.log("Random button pressed");
}

function clearCanvas() {
  background("white");
}

function getRandomDirection(variation) {
  if (variation === 1) {
    return random([-1, 1]);
  } else if (variation === 2) {
    return random([0, 1]);
  } else {
    return random([-1, 0]);
  }
}

// При нажатии клавиши 's' сохраняем изображение в формате GIF
function keyPressed() {
  if (key === 's') {
    saveGif("PG_shift.gif", 20);
  }
}
