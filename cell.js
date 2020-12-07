function cell(i, j, w) {
  this.i = i;
  this.j = j;
  this.x = i * w;
  this.y = j * w;
  this.w = w;
  this.bombCount = 0;

  this.bomb = false;
  this.revealed = false;
}

cell.prototype.show = function () {
  stroke(0);
  noFill();
  rect(this.x, this.y, this.w);
  if (this.revealed) {
    if (this.bomb) {
      fill(0);
      ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
    } else {
      fill(120);
      rect(this.x, this.y, this.w, this.w);
      if (this.bombCount > 0) {
        textAlign(CENTER);
        fill(0);
        text(this.bombCount, this.x + this.w * 0.5, this.y + this.w * 0.7);
      }
    }
  }
};

cell.prototype.contains = function (x, y) {
  return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
};

cell.prototype.reveal = function () {
  this.revealed = true;
  if (this.bombCount == 0) {
    //fill every space
    this.floodFill();
  }
};

cell.prototype.countBombs = function () {
  if (this.bomb) {
    this.bombCount = -1;
    return;
  }
  var total = 0;
  for (var xoff = -1; xoff <= 1; xoff++) {
    for (var yoff = -1; yoff <= 1; yoff++) {
      var i = this.i + xoff;
      var j = this.j + yoff;
      if (i > -1 && i < cols && j > -1 && j < rows) {
        var closeTo = grid[i][j];
        if (closeTo.bomb) {
          total++;
        }
      }
    }
  }
  this.bombCount = total;
};

cell.prototype.floodFill = function () {
  for (var xoff = -1; xoff <= 1; xoff++) {
    for (var yoff = -1; yoff <= 1; yoff++) {
      var i = this.i + xoff;
      var j = this.j + yoff;
      if (i > -1 && i < cols && j > -1 && j < rows) {
        var closeTo = grid[i][j];
        if (!closeTo.bomb && !closeTo.revealed) {
          closeTo.reveal();
        }
      }
    }
  }
};
