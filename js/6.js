let img;
let prevFrames = [];
let isPaused = false;
let useXAxis = true;
let originalImage;

function setup() {
  frameRate(60);
  createCanvas(700, 700).id("myCanvas");
  document.getElementById("myCanvas").style.position = "absolute";
  document.getElementById("myCanvas").style.left = "0";
  document.getElementById("myCanvas").style.top = "0";

  let fileInput = createFileInput(handleFile);
  fileInput.position(1000, 450);
  fileInput.class("fileInput");

  let downloadButton = createButton("Save as PNG");
  downloadButton.position(1000, 660);
  downloadButton.mousePressed(saveFrame);
  downloadButton.class("downloadButton");

  let xAxisButton = createButton("X axis");
  xAxisButton.position(1000, 520);
  xAxisButton.class("xAxisButton");
  xAxisButton.mousePressed(() => {
    useXAxis = true;
  });

  let yAxisButton = createButton("Y axis");
  yAxisButton.position(1120, 520);
  yAxisButton.class("yAxisButton");
  yAxisButton.mousePressed(() => {
    useXAxis = false;
  });

  let replayButton = createButton("Replay");
  replayButton.position(1000, 590);
  replayButton.mousePressed(replayAnimation);
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
          let offset = int(random(-4, 4)) * 4;
          let newLoc;
          if (useXAxis) {
            newLoc = loc + offset;
          } else {
            newLoc = (x + ((y + offset) % img.height) * img.width) * 4;
          }
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
      originalImage = img.get();
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

function replayAnimation() {
  prevFrames = [];
  img = originalImage.get();
}

function keyPressed() {
  if (key === "s") {
    saveGif("PG_shift.gif", 10);
  }
}
