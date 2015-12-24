var Quarto = (function() {
  //Game Pieces
  var Piece = function(shape, height, hollow, color) {
      this.shape = shape;
      this.color = color;
      this.height = height;
      this.hollow = hollow;
    }
    // Proper values are 0 & 1
  Piece.prototype.shape = null;
  Piece.prototype.height = null;
  Piece.prototype.hollow = null;
  Piece.prototype.color = null;

  Piece.prototype.getProperties = function() {
    return [this.shape, this.height, this.hollow, this.color];
  }

  Piece.prototype.isRound = function()  {
    return this.shape == 1;
  }

  Piece.prototype.isSquare = function()  {
    return this.shape == 0;
  }

  Piece.prototype.isTall = function()  {
    return this.height == 1;
  }

  Piece.prototype.isShort = function()  {
    return this.height == 0;
  }

  Piece.prototype.isHollow = function()  {
    return this.hollow == 1;
  }

  Piece.prototype.isFilled = function()  {
    return this.hollow == 0;
  }

  Piece.prototype.isDark = function()  {
    return this.color == 1;
  }

  Piece.prototype.isLight = function()  {
    return this.color == 0;
  }


  Piece.makeAllPieces = function() {
    // shape,height,hollow,color
    return [
      //Light
      new Piece(0, 0, 0, 0), //square short filled light  
      new Piece(1, 0, 0, 0), //round short filled light  

      new Piece(0, 1, 0, 0), //square tall filled light   
      new Piece(1, 1, 0, 0), //round tall filled light

      new Piece(0, 0, 1, 0), //square short hollow light
      new Piece(1, 0, 1, 0), //round short hollow light

      new Piece(0, 1, 1, 0), //square tall hollow light 
      new Piece(1, 1, 0, 0), //round tall hollow light

      //Dark
      new Piece(0, 0, 0, 1), //square short filled dark
      new Piece(1, 0, 0, 1), //round short filled dark

      new Piece(0, 1, 0, 1), //square tall filled dark
      new Piece(1, 1, 0, 1), //round tall filled dark

      new Piece(0, 0, 1, 1), //square short hollow dark
      new Piece(1, 0, 1, 1), //round short hollow dark

      new Piece(0, 1, 1, 1), //square tall hollow dark
      new Piece(1, 1, 1, 1), //round tall hollow dark
    ];
  }

  //GRID STUFF

  function _getPieceInGrid(row, column) {

    var limit = this.grid[0].length;

    if (row >= limit || column >= limit) {
      throw new Error('coordinates are outside grid dimensions');
    }
    return this.grid[row][column];
  };

  function _givePiece(index, properties) {
    //just a
    if (index === null || undefined === index) {
      //find by properties instead 
    }

    var piece = this.pieces[index];

    //do something better than this...
    delete this.pieces[index];
    return piece;
  }

  function _setPiece(row, column, piece) {
    // console.log(this);
    return this.grid[row][column] = piece;
  }

  //Evaluators

  //TODO: optimize this. 
  //Im sure there is a nice very basic mathematical trick to this...
  function _isDarkSet(row) {
    var counter = 0;
    for (i = 0; i < row.length; i++) {
      if (row[i] !== undefined && row[i].isDark()) {
        counter++;
      }
    }
    if (counter === 4) console.log('Dark Quarto');
    return counter === 4;
  }


  function _isLightSet(row) {
    var counter = 0;
    for (i = 0; i < row.length; i++) {
      if (row[i] !== undefined && row[i].isLight()) {
        counter++;
      }
    }
    if (counter === 4) console.log('Light Quarto');
    return counter === 4;
  }

  function _isRoundSet(row) {
    var counter = 0;
    for (i = 0; i < row.length; i++) {
      if (row[i] !== undefined && row[i].isRound()) {
        counter++;
      }
    }
    if (counter === 4) console.log('Round Quarto');
    return counter === 4;
  }

  function _isSquareSet(row) {
    var counter = 0;
    for (i = 0; i < row.length; i++) {
      if (row[i] !== undefined && row[i].isSquare()) {
        counter++;
      }
    }
    if (counter === 4) console.log('Square Quarto');
    return counter === 4;

  }

  function _isTallSet(row) {
    33
    var counter = 0;
    for (i = 0; i < row.length; i++) {
      if (row[i] !== undefined && row[i].isTall()) {
        counter++;
      }
    }
    if (counter === 4) console.log('Tall Quarto');
    return counter === 4;
  }

  function _isShortSet(row) {
    var counter = 0;
    for (i = 0; i < row.length; i++) {
      if (row[i] !== undefined && row[i].isShort()) {
        counter++;
      }
    }
    if (counter === 4) console.log('Short Quarto');
    return counter === 4;
  }

  function _isFilledSet(row) {
    var counter = 0;
    for (i = 0; i < row.length; i++) {
      if (row[i] !== undefined && row[i].isFilled()) {
        counter++;
      }
    }
    if (counter === 4) console.log('Filled Quarto');
    return counter === 4;
  }

  function _isHollowSet(row) {
    var counter = 0;
    for (i = 0; i < row.length; i++) {
      if (row[i] !== undefined && row[i].isHollow()) {
        counter++;
      }
    }
    if (counter === 4) console.log('Hollow Quarto');
    return counter === 4;
  }


  function _isQuarto(lastPiece, row, column) {

    //check X-axis
    var affectedRow = this.grid[row];
    console.log('row', affectedRow);

    if (
      _isLightSet(affectedRow) ||
      _isDarkSet(affectedRow) ||
      _isRoundSet(affectedRow) ||
      _isSquareSet(affectedRow)
    ) {
      console.log('Row Quarto');
      return true;
    }

    var affectedColumn = [
      this.grid[0][column],
      this.grid[1][column],
      this.grid[2][column],
      this.grid[3][column]
    ];

    if (
      _isLightSet(affectedColumn) ||
      _isDarkSet(affectedColumn) ||
      _isRoundSet(affectedColumn) ||
      _isSquareSet(affectedColumn)
    ) {
      console.log('Column Quarto');
      return true;
    }

    //ok yeah, this is could be written around as well but
    // I see this as more readable for early exit.
    if (!(row > 0 && row < 3 && column > 0 && column < 3)) {
      //Not a horizontal or vertical quarto and not a move that creates a diagonal? 
      //Not a Quarto.
      return false;
    }

    //Still here? Must be a diagonal move then.
    var affectedDiagonal;

    if (
      //descending diagonal
      (row === 2 && column === 2) ||
      (row === 3 && column === 3)
    ) {

      affectedDiagonal = [
        this.grid[0][0],
        this.grid[1][1],
        this.grid[2][2],
        this.grid[3][3]
      ];
    } else {
      // row/col must be 2/3 or 3/2 which is ascending diagonal
      affectedDiagonal = [
        this.grid[3][0],
        this.grid[1][2],
        this.grid[2][1],
        this.grid[3][0]
      ];
    }

    if (
      _isLightSet(affectedDiagonal) ||
      _isDarkSet(affectedDiagonal) ||
      _isRoundSet(affectedDiagonal) ||
      _isSquareSet(affectedDiagonal)
    ) {
      console.log('Diagonal Quarto');
      return true;
    }

    return false;
    //affectedDiagonal = 
    //Check Y-axis
    //check diagoal
  }

  return {
    phase: 0, //0,1 => give piece, play piece
    pieces: Piece.makeAllPieces(),
    players: [],
    grid: [
      new Array(4),
      new Array(4),
      new Array(4),
      new Array(4)
    ],
    getPieceInGrid: _getPieceInGrid,
    givePiece: _givePiece,
    setPieceToGrid: _setPiece,
    isQuarto: _isQuarto
  };

})();


var QuartoUI = (function(Quarto) {

  //events
  // Game starts
  // Player selects piece
  // Player plays piece
  // Player declares Quarto

  return {
    lastMove: {
      row: null,
      column: null,
      piece: null
    },
    init: function() {

      //Bind events
      //gamePieces.on('click','.piece',givePiece)

      ([].slice.call(
        document.querySelectorAll('.js-grid-cell')
      )).forEach(function(cell) {
        //TODO: bind only one eventListener to grid, find target from event object
        cell.addEventListener('click', this.setPiece, true);
      }, this);

      ([].slice.call(
        document.querySelectorAll('.js-piece')
      )).forEach(function(cell) {
        //TODO: bind only one eventListener to grid, find target from event object
        cell.addEventListener('click', this.givePiece, true);
      }, this);




      //quartoButton.on('click',isQuarto)
    },
    givePiece: function(e) {
      console.log(e);
      if (Quarto.phase !== 0) {
        return false;
      }
      Quarto.phase = 1;
      return this;
      //Move piece from piecebox to playbox
    },
    setPiece: function(e) {
      console.log(e);
      // if (Quarto.phase !== 1) {
      //   return false;
      // }

      var coords = e.target.id.split('-');
      coords.shift(); //discard 'cell'
      //TODO better grid tokenizing. Not bad but could be better.

      console.log(coords);
      //move piece from playbox to grid
    },
    shoutQuarto: function() {
      if (Quarto.isQuarto(this.lastMove.row, this.lastMove.column, this.lastMove.piece)) {
        if (confirm('You Win!')) {
          window.location.reload();
        };

      }
      return this;
    }

  };

})(Quarto);

document.addEventListener("DOMContentLoaded", function(event) {
  QuartoUI.init();
});


// Quarto.setPieceToGrid(0, 0, Quarto.givePiece(1));
// Quarto.setPieceToGrid(1, 0, Quarto.givePiece(4));
// Quarto.setPieceToGrid(2, 0, Quarto.givePiece(6));
// var lastPiece = Quarto.givePiece(8);
// Quarto.setPieceToGrid(3, 0, lastPiece);

// console.log(
//   Quarto.isQuarto(lastPiece, 3, 0)
// );