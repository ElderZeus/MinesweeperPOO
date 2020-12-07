//Minesweeper

function createArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

var grid;
var cols;
var rows;
var w = 20;
var totalBombs;
var playing = true;
var pieces = 0;

function setup() {
  createCanvas(300, 300);
  reset();
}

function mousePressed() {
  if (playing == true && pieces != 0) {
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if (grid[i][j].contains(mouseX, mouseY)) {
          grid[i][j].reveal();
          pieces--;
          if (grid[i][j].bomb) {
            game0ver();
          }
        }
      }
    }
  } else {
    reset();
    playing = true;
  }
}

function draw() {
  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
  if (pieces == 0 || playing == false) {
    let words = pieces == 0 ? "You win!" : "You lose!";
    push();
    rectMode(RADIUS);
    fill(0);
    strokeWeight(5);
    if (words == "You win!") {
      stroke(0, 255, 100);
    } else {
      stroke(255, 23, 124);
    }
    rect(width / 2, height / 2, width, 60);
    rectMode(CORNER);
    noStroke();
    if (words == "You win!") {
      fill(0, 255, 100);
    } else {
      fill(255, 23, 124);
    }
    textSize(50);
    textAlign(CENTER, CENTER);
    text(words, 0, 0, width, height);
    pop();
  }
}

function game0ver() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
    }
  }
  playing = false;
}

reset = () => {
  cols = floor(width / w);
  rows = floor(height / w);
  totalBombs = 20;
  pieces = cols * rows - totalBombs;
  grid = createArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new cell(i, j, w);
    }
  }
  placeBombs();
};

function placeBombs() {
  //pick spots for bombs
  var options = null;
  options = [];
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      options.push([i, j]);
    }
  }
  for (var b = 0; b < totalBombs; b++) {
    var index = floor(random(options.length));
    var choice = options[index];
    var i = choice[0];
    var j = choice[1];
    //delet chosen spot to avoid choosing it again
    options.splice(index, 1);
    grid[i][j].bomb = true;
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].countBombs();
    }
  }
}
