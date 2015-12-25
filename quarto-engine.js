//node or browser? everything goes as long as we have game pieces

if (!Piece && typeof require !== 'undefined') {
  var Piece = require('./piece.js');
}

if (!Piece) {
  var msg = 'We need some game pieces in order to play';
  throw new Error(msg);
  if (alert) {
    alert(msg);
  }
}


//The game engine
var Quarto = (function() {

  //GRID STUFF

  function _getPiece(row, column) {

    var limit = this.grid[0].length;

    if (row >= limit || column >= limit) {
      throw new Error('coordinates are outside grid dimensions');
    }
    console.log(ṭhis.grid);
    // return null;
    return this.grid[row][column];
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
    //why did I write this? It's just an ANTIPATTERN
    //TODO: Get rid of it man. I don't want to wrap everything to try/catch 
    //There is nothing the user can do to break this in any way.
    if (piece.constructor !== Piece) {
      throw new Error(Piece.NOT_A_PIECE)
    }

    if (this.grid[row][column] !== undefined) {
      console.log('That slot is already populated. Try another one');
      return false;
    }

    return this.grid[row][column] = piece;
  }

  //Evaluators

  //TODO: optimize this. 
  //Im sure there is a nice very basic mathematical trick to this...
  //Also, expose these methods for testing
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


  function _setIsQuarto(set) {
    return (
      _isLightSet(set) ||
      _isDarkSet(set) ||
      _isRoundSet(set) ||
      _isSquareSet(set) ||
      _isShortSet(set) ||
      _isTallSet(set) ||
      _isFilledSet(set) ||
      _isHollowSet(set)
    );
  }

  function _isQuarto(lastPiece, row, column) {
    console.log(this.grid);
    if (!lastPiece || lastPiece.constructor !== Piece) {
      throw new Error(Piece.NOT_A_PIECE)
    }

    //check X-axis
    var affectedRow = this.grid[row];
    // console.log('row', affectedRow);

    if (_setIsQuarto(affectedRow)) {
      console.log('Row Quarto');
      return true;
    }

    var affectedColumn = [
      this.grid[0][column],
      this.grid[1][column],
      this.grid[2][column],
      this.grid[3][column]
    ];

    if (_setIsQuarto(affectedColumn)) {
      console.log('Column Quarto');
      return true;
    }

    //Still here? Must be a diagonal row then.
    var affectedDiagonal;

    if (row === column) {
      //descending
      affectedDiagonal = [
        this.grid[0][0],
        this.grid[1][1],
        this.grid[2][2],
        this.grid[3][3]
      ];
    } else {
      // ascending
      affectedDiagonal = [
        this.grid[3][0],
        this.grid[2][1],
        this.grid[1][2],
        this.grid[0][3]
      ];
    }

    if (_setIsQuarto(affectedDiagonal)) {
      console.log('Diagonal Quarto');
      return true;
    }

    return false;
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
    this.quartoString = null;
    return this;
  }

  return {
    start: _startGame,
    phase: 0, //0,1 => give piece, play piece
    pieces: null,
    grid: null,
    getPieceInGrid: _getPiece,
    givePiece: _givePiece,
    setPieceToGrid: _setPiece,
    isQuarto: _isQuarto,
    evaluators: {
      isLightSet: _isLightSet,
      isDarkSet: _isDarkSet,
      isRoundSet: _isRoundSet,
      isSquareSet: _isSquareSet,
      isShortSet: _isShortSet,
      isTallSet: _isTallSet,
      isFilledSet: _isFilledSet,
      isHollowSet: _isHollowSet
    }
  };

})();

if (typeof module !== 'undefined') module.exports = Quarto;