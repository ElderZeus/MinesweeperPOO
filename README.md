# Projecto Final
## MineSweeper: A New Hope

### Introducción
Como elemento final de la catedra Programación Orientada a Objetos se plantea el proyecto de replicar el clasico de 1989  *Minesweeper-Buscaminas*, con el fin de emplear el paradigma de uso de objetos y demostrar los conocimientos adquiridos a lo largo del semestre. Adicional, se desarrolla el projecto en base *JavaScript* ya que es un lenguaje de programacion nuevo, del cual este proyecto seria la primera aproximacion. Por lo anterior se quiere rendir homenaje al juego original aprendiendo la sintaxis de un nuevo lenguaje de programacion. Adicional se utiliza la libreria ``P5.js`` como se ha venido trabajando en proyectos anteriores.

### Desarrollo
Como primer paso se establece el algoritmo basico del juego para poder idear el sistema de Objetos y funciones que mejor se adecue, para lo cual podemos observar que por normal general se cumple con lo siguiente:![Img001](https://i.imgur.com/nOr6M7t.png)
Gracias a esta representacion grafica se hace facil ubicar los objetos basicos necesarios para el funcionamiento del juego, para lo cual establecemos que, los datos del juego van a ser almacenados en un arreglo bidimensional, dentro del arreglo se establecen dos valores de estado, tiene o no tiene una bomba; esto se lleva a cabo con las siguientes funciones:
```javascript
function reset() {
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
}
```
```javascript
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
```
Ya con los valores asignados nos disponemos a establecer la manera para revelear estos en el tablero; se establece como estado inicial de juego todos los bloques ocultos con
```javascript
this.revealed = false;
```
Almacenada dentro del objeto ``cell``, gracias alo cual podemos crear una funcion para el manejo de los datos del mouse, anexo a las posibilidades que nos da la libreria ``P5.js``, la cual es:
```javascript
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
```
En la cual, si damos click sobre un cuadro, evalua las coordenadas X-Y del mismo, si esta casilla tiene asignado el valor de una bomba nos lleva a la pantalla de ``Game 0ver``, de lo contrario revela la casilla. Lo anterior es posible gracias a la funcion ``contains``:
```javascript
cell.prototype.contains = function (x, y) {
  return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
};
```
*** Evalua las coordenadas X-Y y las ubica dentro del cuadro correspondiente de la manera que, evalua el intervalo correspondiente [x,x+w] y [y,y+w] lo cual permite encasillar el valor del click dentro de un bloque del juego.***
Y a la funcion ``reveal``:
```javascript
cell.prototype.reveal = function () {
  this.revealed = true;
  if (this.bombCount == 0) {
    //fill every space
    this.floodFill();
  }
};
```
La cual cambia el estado de la casilla a ``revealed = True`` y nos introduce a uno de los puntosque mas se dificultaron en el desarrollo, el ``FloodFill``, termino que hace referencia al llenado de espacios aledaños cumpliento determinada condicion, en este proyecto, la condicion a cumplir es la de que los recuadros cambien su estado a ``revealed`` si no tienen bombas en el intermedio. Para determinar si existen o no bombas, se analizan las 8 casillas proximas a cada celda con el siguiente:
```javascript
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
```
Analiza las coordenadas aledañas ``X-Y`` y almacena el valos de casillas que tiene un estado ``bomb = true`` en la variable ``bombCount`` la cual es la utilizada para imprimir en pantalla el numero caracteristico que nos dice cuantas bombas hay en el area de 8 celdas aledaño a cada casilla.
```javascript
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
```
Con la funcion ``floodFill`` se analiza el area que rodea a la celda y se almacenan los valores de coordenadas en el arreglo ``closeTo``, luego evalua si las coordenadas almacenadas **NO** cumplen con las dos condiciones ``bomb`` y ``revealed``, si cumple, pasa a aplicar la funcion ``reveal``.
Por ultimo la funcion ``game0ver`` es la que permite establecer si se ha activado una bomba, para lo cual establece el valor de ``playing = false``, revela todo el tablero y muestra la pantalla de fin de juego.

### Mejoras a futuro
El principal punto a mejorar radica en la imposibilidad de ganar el juego, ya que no se pudo establecer el sistema de banderas y condiciones para ganar. Segundo, se podria utilizar un sistema mas dinamico en el cual el usuario ingrese los valores de ``tamaño grid`` y ``cantidad bombas``, lo cual no fue posible debido al poco conocimiento con el manejo de ``HTML``. Por ultimo, se quiere implementar un sistema de cambio en el diseño del ``grid`` permitiendo que se dibuje el tablero de manera clasica, o en forma de panal de abejas, o cualquier otra forma, como elemento diferenciador.

### Referencias
Todo el codigo encontrado con anterioridad es posible gracias a la informacion suministrada por los siguientes:
- [Buscaminas, Wikipedia.](https://es.wikipedia.org/wiki/Buscaminas).
- [The Minesweeper game in 100 lines of JavaScript](http://slicker.me/javascript/mine/minesweeper.htm).
- Video tutorial:[JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour](https://www.youtube.com/watch?v=W6NZfCO5SIk).
- Algoritmo [FloodFill](https://es.wikipedia.org/wiki/Algoritmo_de_relleno_por_difusión).
- [Build your own MINESWEEPER game in pure JavaScript, HTML and CSS using RECURSION](https://dev.to/ania_kubow/build-your-own-minesweeper-game-in-pure-javascript-html-and-css-using-recursion-29e0).
