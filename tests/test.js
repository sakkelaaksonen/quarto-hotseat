var expect = require('chai').expect;
var _ = require('underscore');
// console.log(_);
var Piece = require('../piece.js');
var Quarto = require('../quarto-proto.js');

describe('Quarto Game Engine', function() {
  describe('Pieces', function() {

    //One test to test them all
    it('should make all pieces with Piece.makeAllPieces', function() {
      expect(Piece.makeAllPieces()).to.have.length(16);
    });

    it('should return the properties given in constructor with getProperties', function() {
      var p = new Piece(0, 0, 0, 0);
      expect(p.getProperties()[0]).to.equal(0);
      expect(p.getProperties()[1]).to.equal(0);
      expect(p.getProperties()[2]).to.equal(0);
      expect(p.getProperties()[3]).to.equal(0);
    })

    it('should make a square short filled light piece', function() {
      var p = new Piece(0, 0, 0, 0);

      expect(p.isLight()).to.be.true;
      expect(p.isShort()).to.be.true;
      expect(p.isFilled()).to.be.true;
      expect(p.isSquare()).to.be.true;

      expect(p.isTall()).to.be.false;
      expect(p.isRound()).to.be.false;
      expect(p.isHollow()).to.be.false;
      expect(p.isDark()).to.be.false;
    });

    it('should make a round tall dark hollow piece', function() {
      var p = new Piece(1, 1, 1, 1);

      expect(p.isDark()).to.be.true;
      expect(p.isRound()).to.be.true;
      expect(p.isHollow()).to.be.true;
      expect(p.isTall()).to.be.true;

      expect(p.isLight()).to.be.false;
      expect(p.isShort()).to.be.false;
      expect(p.isFilled()).to.be.false;
      expect(p.isSquare()).to.be.false;

    });

  });

  describe('Quarto.start ', function() {
    it('should make all pieces and set phase to 0', function() {
      Quarto.start();
      expect(Quarto.phase).to.equal(0);
      expect(Quarto.pieces).to.have.length(16);
    });

    it('should reset the grid', function() {
      Quarto.grid[0][0] = 1;
      expect(Quarto.start().grid[0][0]).not.to.equal(1);

    });
  });


  describe('Quarto.givePiece', function() {
    it('should remove a piece from list with given index', function() {

      Quarto.start();

      var lastPiece = Quarto.givePiece(15);

      expect(lastPiece.constructor).to.equal(Piece);
      expect(Quarto.pieces).to.have.length(15);

      expect(Quarto.givePiece(1).constructor).equal(Piece);

      expect(Quarto.pieces).to.have.length(14);

      expect(Quarto.givePiece(6).constructor).equal(Piece);

      expect(Quarto.pieces).to.have.length(13);

    });
  });


  describe('Quarto.setPiece & Quarto.getPiece', function() {
    Quarto.start();
    it('should set a piece to given grid cell and get that same piece from that same cell', function() {

      var thePiece = Quarto.givePiece(0);
      expect(Quarto.setPieceToGrid.bind(Quarto, 0, 0, {
        a: 1
      })).to.throw(/this shit/);
      expect(Quarto.setPieceToGrid(0, 0, thePiece)).to.equal(thePiece);
      expect(Quarto.getPieceInGrid.bind(Quarto, 5, 5)).to.throw(/coordinates/);
    });
  });




  describe('Quarto.isQuarto', function() {

    expect(Quarto.isQuarto.bind(Quarto,null,null,null)).to.throw(Piece.NOT_A_PIECE);
    expect(Quarto.isQuarto(new Piece(0,0,0,0),0,0)).to.be.false;


    function play(move1, move2, move3, move4) {
      Quarto.start();
      Quarto.setPieceToGrid(move1.row, move1.column, Quarto.givePiece(move1.piece));
      Quarto.setPieceToGrid(move2.row, move2.column, Quarto.givePiece(move2.piece));
      Quarto.setPieceToGrid(move3.row, move3.column, Quarto.givePiece(move3.piece));
      var lastPiece = Quarto.givePiece(move4.piece);
      Quarto.setPieceToGrid(move4.row, move4.column, lastPiece);
      return {last:lastPiece, move:move4};
    }


    it('should be a row quarto of light pieces', function() {
      
      result = play({
        row: 0,
        column: 0,
        piece: 0
      }, {
        row: 0,
        column: 1,
        piece: 0
      }, {
        row: 0,
        column: 2,
        piece: 0
      }, {
        row: 0,
        column: 3,
        piece: 0
      });
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });

    it('should be a column quarto of light pieces', function() {
      
      result = play({
        row: 0,
        column: 0,
        piece: 0
      }, {
        row: 1,
        column: 0,
        piece: 0
      }, {
        row: 2,
        column: 0,
        piece: 0
      }, {
        row: 3,
        column: 0,
        piece: 0
      });
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });
    it('should be a diagonal quarto of light pieces', function() {
      
      result = play({
        row: 0,
        column: 0,
        piece: 0
      }, {
        row: 1,
        column: 1,
        piece: 0
      }, {
        row: 2,
        column: 2,
        piece: 0
      }, {
        row: 3,
        column: 3,
        piece: 0
      });
      // console.log(Quarto.grid);
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });

    it('should be a row quarto of dark pieces', function() {
      
      result = play({
        row: 0,
        column: 0,
        piece: 8
      }, {
        row: 0,
        column: 1,
        piece: 8
      }, {
        row: 0,
        column: 2,
        piece: 8
      }, {
        row: 0,
        column: 3,
        piece: 8
      });
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });

    it('should be a column quarto of dark pieces', function() {
      
      result = play({
        row: 0,
        column: 0,
        piece: 8
      }, {
        row: 1,
        column: 0,
        piece: 8
      }, {
        row: 2,
        column: 0,
        piece: 8
      }, {
        row: 3,
        column: 0,
        piece: 8
      });
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });
    it('should be a diagonal quarto of dark pieces', function() {
      
      result = play({
        row: 0,
        column: 3,
        piece: 10
      }, {
        row: 1,
        column: 2,
        piece: 10
      }, {
        row: 2,
        column: 1,
        piece: 10
      }, {
        row: 3,
        column: 0,
        piece: 10
      });
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });


    it('should be a row quarto of round pieces', function() {
      
      result = play({
        row: 3,
        column: 0,
        piece: 1
      }, {
        row: 3,
        column: 1,
        piece: 2
      }, {
        row: 3,
        column: 2,
        piece: 3
      }, {
        row: 3,
        column: 3,
        piece: 6
      });
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });
    it('should be a column quarto of round pieces',function() {
      
      result = play({
        row: 0,
        column: 3,
        piece: 1
      }, {
        row: 1,
        column: 3,
        piece: 2
      }, {
        row: 2,
        column: 3,
        piece: 3
      }, {
        row: 3,
        column: 3,
        piece: 6
      });
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });
    
    it('should be a diagonal quarto of round pieces',function() {
      
      result = play({
        row: 3,
        column: 0,
        piece: 1
      }, {
        row: 1,
        column: 2,
        piece: 2
      }, {
        row: 2,
        column: 1,
        piece: 3
      }, {
        row: 3,
        column: 0,
        piece: 6
      });
      expect(Quarto.isQuarto(result.last,result.move.row,result.move.column)).to.be.true;
    });

    it('should be a row quarto of square pieces');
    it('should be a column quarto of square pieces');
    it('should be a diagonal quarto of square pieces');

    it('should be a row quarto of tall pieces');
    it('should be a column quarto of tall pieces');
    it('should be a diagonal quarto of tall pieces');

    it('should be a row quarto of short pieces');
    it('should be a column quarto of short pieces');
    it('should be a diagonal quarto of short pieces');

    it('should be a row quarto of filled pieces');
    it('should be a column quarto of filled pieces');
    it('should be a diagonal quarto of filled pieces');

    it('should be a row quarto of hollow pieces');
    it('should be a column quarto of hollow pieces');
    it('should be a diagonal quarto of hollow pieces');


  });


});