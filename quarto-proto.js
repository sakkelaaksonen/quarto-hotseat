var Piece = require('./piece.js');
// console.log(Piece);
var Quarto = (function() {

  //GRID STUFF

  function _getPiece(row, column) {

    var limit = this.grid[0].length;

    if (row >= limit || column >= limit) {
      throw new Error('coordinates are outside grid dimensions');
    }
    console.log(ṭhis.grid);
    return null;
    // return this.grid[row][column];
  };

  function _givePiece(index, properties) {
    //just a
    if (index === null || undefined === index) {
      //find by properties instead 
    }

    var piece = this.pieces.splice(index, 1).shift();
    return piece;
  }

  function _setPiece(row, column, piece) {
    if (piece.constructor !== Piece) {
      throw new Error('what is this shit you are giving me man?!')
    }
    //TODO Error handling
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

  _startGame = function() {
    this.pieces = Piece.makeAllPieces();
    this.phase = 0;
    this.grid = [
      new Array(4),
      new Array(4),
      new Array(4),
      new Array(4)
    ];
    return this;
    // this.currentPlayer = 1;
  }

  return {
    // this.currentPlayer:1;
    start: _startGame,
    phase: 0, //0,1 => give piece, play piece
    pieces: null,
    // players: [],
    grid: null,
    getPieceInGrid: _getPiece,
    givePiece: _givePiece,
    setPieceToGrid: _setPiece,
    isQuarto: _isQuarto,
  };

})();
module.exports = Quarto;