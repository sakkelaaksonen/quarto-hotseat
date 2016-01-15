var expect = require('chai').expect;
// var _ = require('underscore');
// console.log(_);
var Piece = require('../piece.js');
var Quarto = require('../quarto-engine.js');

function playAndTest(move1, move2, move3, move4) {
  Quarto.start();
  Quarto.setPieceToGrid(move1.row, move1.column,move1.piece );
  Quarto.setPieceToGrid(move2.row, move2.column, move2.piece);
  Quarto.setPieceToGrid(move3.row, move3.column, move3.piece);
  var lastPiece = move4.piece;
  Quarto.setPieceToGrid(move4.row, move4.column, lastPiece);
  expect(Quarto.isQuarto(lastPiece,move4.row,move4.column)).to.be.true;
      
}

describe('Quarto Game Engine', function() {

  describe('Piece.getPropertyString',function() {
    it('should give a string containing "light square short filled" ',function(){
      var p = new Piece(0,0,0,0);

      expect(p.getPropertyString).to.match(/light/);
      expect(p.getPropertyString).to.match(/square/);
      expect(p.getPropertyString).to.match(/filled/);
      expect(p.getPropertyString).to.match(/short/);
    });

    it('should give a string containing "dark round tall hollow" ',function(){
      var p = new Piece(1,1,1,1);

      expect(p.getPropertyString).to.match(/dark/);
      expect(p.getPropertyString).to.match(/round/);
      expect(p.getPropertyString).to.match(/hollow/);
      expect(p.getPropertyString).to.match(/tall/);
    });
    
  });
//Quarto Game Engine
//TODO make quarto-test.js
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
    
    it('should set a piece to given grid cell and get that same piece from that same cell', function() {
    	Quarto.start();
      //give a piece
      var thePiece = Quarto.givePiece(0);
      // expect(Quarto.setPieceToGrid.bind(Quarto, 0, 0, {
      //   a: 1
      // })).to.throw(/this shit/);
      expect(Quarto.setPieceToGrid(0, 0, thePiece)).to.equal(thePiece);
      
    });

    // it('should throw an error when grid coordinates are out of bounds',function() {
    // 	Quarto.start();
    //   //And when would that ever occur? Excessive bullshit this is...
    //   expect(Quarto.getPieceInGrid.bind(Quarto, 5, 5)).to.throw(/coordinates/);
    // });

    it('should not allow replacing a piece in already occupied slot',function() {

    	Quarto.start();
    	var piece = Quarto.givePiece(0);
      expect(Quarto.setPieceToGrid(0, 0, piece)).to.equal(piece);

      expect(
      	Quarto.setPieceToGrid.bind(Quarto ,0, 0, Quarto.givePiece(0))
      	).to.throw(/already populated/)

			var piece = Quarto.givePiece(0);
      expect(Quarto.setPieceToGrid(1, 0, piece)).to.equal(piece);
			expect(
      	Quarto.setPieceToGrid.bind(Quarto ,1, 0, Quarto.givePiece(0))
    	).to.throw(/already populated/)      

			var piece = Quarto.givePiece(0);
      expect(Quarto.setPieceToGrid(1, 1, piece)).to.equal(piece);
      expect(
      	Quarto.setPieceToGrid.bind(Quarto ,1, 1, Quarto.givePiece(0))
    	).to.throw(/already populated/)
      

    })
  });

  describe('Quarto.evaluators.isDarkSet',function(){
    it('should be a dark set',function(){
        expect(
          Quarto.evaluators.isDarkSet([
          new Piece(0,0,0,1),
          new Piece(1,0,0,1),
          new Piece(0,1,0,1),
          new Piece(1,1,1,1)
          ])
        ).to.be.true;

          expect(
          Quarto.evaluators.isDarkSet([
          new Piece(1,0,0,1),
          new Piece(1,1,0,1),
          new Piece(0,0,0,1),
          new Piece(1,0,1,1)
          ])
        ).to.be.true;
    })
  });

  describe('Quarto.evaluators.isLightSet',function(){
    it('should be a light set',function(){
        expect(
          Quarto.evaluators.isLightSet([
          new Piece(0,0,0,0),
          new Piece(1,0,0,0),
          new Piece(0,1,0,0),
          new Piece(1,1,1,0)
          ])
        ).to.be.true;

          expect(
          Quarto.evaluators.isLightSet([
          new Piece(1,0,0,0),
          new Piece(1,1,0,0),
          new Piece(0,0,0,0),
          new Piece(1,0,1,0)
          ])
        ).to.be.true;
    })
  });


  describe('Quarto.evaluators.isRoundSet',function(){
    it('should be a round set',function(){
        expect(
          Quarto.evaluators.isRoundSet([
          new Piece(1,0,0,1),
          new Piece(1,0,0,0),
          new Piece(1,1,0,1),
          new Piece(1,1,1,0)
          ])
        ).to.be.true;

          expect(
          Quarto.evaluators.isRoundSet([
          new Piece(1,0,0,1),
          new Piece(1,1,0,1),
          new Piece(1,0,1,1),
          new Piece(1,1,1,1)
          ])
        ).to.be.true;
    })
  });

  describe('Quarto.evaluators.isSquareSet',function(){
    it('should be a square set',function(){
        expect(
          Quarto.evaluators.isSquareSet([
          new Piece(0,1,1,1),
          new Piece(0,0,0,1),
          new Piece(0,1,0,1),
          new Piece(0,1,1,0)
          ])
        ).to.be.true;

          expect(
          Quarto.evaluators.isSquareSet([
          new Piece(0,1,0,1),
          new Piece(0,1,0,0),
          new Piece(0,0,0,1),
          new Piece(0,0,1,1)
          ])
        ).to.be.true;
    })
  });

  describe('Quarto.evaluators.isTallSet',function(){
    it('should be a tall set',function(){
        expect(
          Quarto.evaluators.isTallSet([
          new Piece(0,1,0,1),
          new Piece(1,1,0,1),
          new Piece(0,1,0,1),
          new Piece(1,1,1,1)
          ])
        ).to.be.true;

          expect(
          Quarto.evaluators.isTallSet([
          new Piece(1,1,0,1),
          new Piece(1,1,0,0),
          new Piece(0,1,0,1),
          new Piece(1,1,0,0)
          ])
        ).to.be.true;
    })
  });

describe('Quarto.evaluators.isShortSet',function(){
    it('should be a short set',function(){
        expect(
          Quarto.evaluators.isShortSet([
          new Piece(1,0,0,0),
          new Piece(1,0,0,1),
          new Piece(0,0,0,1),
          new Piece(1,0,1,1)
          ])
        ).to.be.true;

          expect(
          Quarto.evaluators.isShortSet([
          new Piece(0,0,1,1),
          new Piece(0,0,0,0),
          new Piece(0,0,0,1),
          new Piece(1,0,1,1)
          ])
        ).to.be.true;
    })
  });


describe('Quarto.evaluators.isFilledSet',function(){
    it('should be a dark set',function(){
        expect(
          Quarto.evaluators.isFilledSet([
          new Piece(0,0,0,1),
          new Piece(1,0,0,1),
          new Piece(0,1,0,1),
          new Piece(1,1,0,1)
          ])
        ).to.be.true;

          expect(
          Quarto.evaluators.isFilledSet([
          new Piece(0,0,0,0),
          new Piece(1,1,0,1),
          new Piece(0,0,0,1),
          new Piece(1,0,0,1)
          ])
        ).to.be.true;
    })
  });

describe('Quarto.evaluators.isHollowSet',function(){
    it('should be a dark set',function(){
        expect(
          Quarto.evaluators.isHollowSet([
          new Piece(0,0,1,1),
          new Piece(1,0,1,1),
          new Piece(0,1,1,1),
          new Piece(1,1,1,1)
          ])
        ).to.be.true;

          expect(
          Quarto.evaluators.isHollowSet([
          new Piece(1,0,1,1),
          new Piece(1,1,1,1),
          new Piece(0,0,1,1),
          new Piece(1,0,1,1)
          ])
        ).to.be.true;
    })
  });


  describe('Quarto.isQuarto', function() {
    Quarto.start();
    expect(Quarto.isQuarto.bind(Quarto,null,null,null)).to.throw(Piece.NOT_A_PIECE);
    expect(Quarto.isQuarto(new Piece(0,0,0,0),0,0)).to.be.false;


    it('should be a row quarto of light pieces', function() {
      
      playAndTest({
        row: 0,
        column: 0,
        piece: new Piece(0,1,0,0)
      }, {
        row: 0,
        column: 1,
        piece: new Piece(1,0,0,0)
      }, {
        row: 0,
        column: 2,
        piece: new Piece(0,0,1,0)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(0,1,1,0)
      });

    });

    it('should be a column quarto of light pieces', function() {
      
      playAndTest({
        row: 0,
        column: 0,
        piece: new Piece(0,1,1,0)
      }, {
        row: 1,
        column: 0,
        piece: new Piece(0,1,0,0)
      }, {
        row: 2,
        column: 0,
        piece: new Piece(0,0,0,0)
      }, {
        row: 3,
        column: 0,
        piece: new Piece(1,0,1,0)
      });

    });

    it('should be a diagonal quarto of light pieces', function() {
      
      playAndTest({
        row: 0,
        column: 0,
        piece: new Piece(0,1,0,0)
      }, {
        row: 1,
        column: 1,
        piece: new Piece(0,0,0,0)
      }, {
        row: 2,
        column: 2,
        piece: new Piece(0,0,1,0)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(1,0,1,0)
      });

    });

    it('should be a row quarto of dark pieces', function() {
      
      playAndTest({
        row: 0,
        column: 0,
        piece: new Piece(0,0,0,1)
      }, {
        row: 0,
        column: 1,
        piece: new Piece(1,0,0,1)
      }, {
        row: 0,
        column: 2,
        piece: new Piece(1,1,1,1)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(1,0,0,1)
      });
      
    });

    it('should be a column quarto of dark pieces', function() {
      
      playAndTest({
        row: 0,
        column: 0,
        piece: new Piece(0,1,0,1)
      }, {
        row: 1,
        column: 0,
        piece: new Piece(0,0,0,1)
      }, {
        row: 2,
        column: 0,
        piece: new Piece(1,1,1,1)
      }, {
        row: 3,
        column: 0,
        piece: new Piece(0,0,0,1)
      });

    });

    it('should be a diagonal quarto of dark pieces', function() {
      
      playAndTest({
        row: 0,
        column: 3,
        piece: new Piece(0,0,0,1)
      }, {
        row: 1,
        column: 2,
        piece: new Piece(0,1,0,1)
      }, {
        row: 2,
        column: 1,
        piece: new Piece(1,1,1,1)
      }, {
        row: 3,
        column: 0,
        piece: new Piece(0,0,0,1)
      });
      
    });


    it('should be a row quarto of round pieces', function() {
      
      playAndTest({
        row: 3,
        column: 0,
        piece: new Piece(1,0,0,1)
      }, {
        row: 3,
        column: 1,
        piece: new Piece(1,0,1,1)
      }, {
        row: 3,
        column: 2,
        piece: new Piece(1,0,0,0)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(1,1,1,1)
      });

    });

    it('should be a column quarto of round pieces',function() {
      
      playAndTest({
        row: 0,
        column: 3,
        piece: new Piece(1,0,0,0)
      }, {
        row: 1,
        column: 3,
        piece: new Piece(1,1,1,1)
      }, {
        row: 2,
        column: 3,
        piece: new Piece(1,0,1,0)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(1,1,1,0)
      });

    });
    
    it('should be a diagonal quarto of round pieces',function() {
      
      playAndTest({
        row: 3,
        column: 0,
        piece: new Piece(1,0,0,1)
      }, {
        row: 1,
        column: 2,
        piece: new Piece(1,1,1,0)
      }, {
        row: 2,
        column: 1,
        piece: new Piece(1,1,0,0)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(1,0,0,0)
      });

    });

    it('should be a row quarto of square pieces',function() {
      
      playAndTest({
        row: 2,
        column: 0,
        piece: new Piece(0,1,1,0)
      }, {
        row: 2,
        column: 1,
        piece: new Piece(0,0,0,0)
      }, {
        row: 2,
        column: 2,
        piece: new Piece(0,1,0,1)
      }, {
        row: 2,
        column: 3,
        piece: new Piece(0,0,0,1)
      });

    });
 
    it('should be a column quarto of square pieces',function(){
      playAndTest({
        row: 2,
        column: 3,
        piece: new Piece(0,1,1,0)
      }, {
        row: 1,
        column: 3,
        piece: new Piece(0,1,0,0)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(0,1,0,1)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(0,0,0,1)
      });
    });
    it('should be a diagonal quarto of square pieces',function() {
      playAndTest({
        row: 0,
        column: 0,
        piece: new Piece(0,1,0,0)
      }, {
        row: 1,
        column: 1,
        piece: new Piece(0,0,0,0)
      }, {
        row: 2,
        column: 2,
        piece: new Piece(0,1,0,1)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(0,1,1,1)
      });

    });

    it('should be a row quarto of tall pieces',function() {
      playAndTest({
        row: 2,
        column: 3,
        piece: new Piece(0,1,1,0)
      }, {
        row: 2,
        column: 0,
        piece: new Piece(0,1,0,0)
      }, {
        row: 2,
        column: 1,
        piece: new Piece(0,1,1,1)
      }, {
        row: 2,
        column: 2,
        piece: new Piece(1,1,0,1)
      });

    });

    it('should be a column quarto of tall pieces',function() {
      playAndTest({
        row: 2,
        column: 3,
        piece: new Piece(0,1,1,0)
      }, {
        row: 1,
        column: 3,
        piece: new Piece(1,1,0,0)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(0,1,1,1)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(0,1,0,1)
      });

    });

    it('should be a diagonal quarto of tall pieces',function(){
      playAndTest({
        row: 3,
        column: 0,
        piece: new Piece(1,1,1,0)
      }, {
        row: 2,
        column: 1,
        piece: new Piece(0,1,0,0)
      }, {
        row: 1,
        column: 2,
        piece: new Piece(0,1,0,1)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(1,1,0,1)
      });

    });

    it('should be a row quarto of short pieces',function() {

      playAndTest({
        row: 0,
        column: 3,
        piece: new Piece(0,0,1,0)
      }, {
        row: 0,
        column: 2,
        piece: new Piece(0,0,0,0)
      }, {
        row: 0,
        column: 1,
        piece: new Piece(0,0,0,1)
      }, {
        row: 0,
        column: 0,
        piece: new Piece(1,0,0,1)
      });

    });

    it('should be a column quarto of short pieces',function() {

      playAndTest({
        row: 2,
        column: 0,
        piece: new Piece(0,0,0,0)
      }, {
        row: 1,
        column: 0,
        piece: new Piece(1,0,0,0)
      }, {
        row: 0,
        column: 0,
        piece: new Piece(0,0,0,1)
      }, {
        row: 3,
        column: 0,
        piece: new Piece(0,0,1,1)
      });

    });

    it('should be a diagonal quarto of short pieces',function() {

      playAndTest({
        row: 0,
        column: 0,
        piece: new Piece(0,0,1,0)
      }, {
        row: 1,
        column: 1,
        piece: new Piece(0,0,0,0)
      }, {
        row: 2,
        column: 2,
        piece: new Piece(0,0,0,1)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(1,0,0,1)
      });
      // console.log(Quarto.grid);
    });

    it('should be a row quarto of filled pieces',function() {
      playAndTest({
        row: 2,
        column: 3,
        piece: new Piece(0,1,0,0)
      }, {
        row: 2,
        column: 1,
        piece: new Piece(1,1,0,0)
      }, {
        row: 2,
        column: 2,
        piece: new Piece(0,1,0,1)
      }, {
        row: 2,
        column: 0,
        piece: new Piece(0,1,0,1)
      });

    });

    it('should be a column quarto of filled pieces', function(){
      playAndTest({
        row: 2,
        column: 0,
        piece: new Piece(0,0,0,0)
      }, {
        row: 1,
        column: 0,
        piece: new Piece(0,1,0,0)
      }, {
        row: 0,
        column: 0,
        piece: new Piece(0,1,0,1)
      }, {
        row: 3,
        column: 0,
        piece: new Piece(1,1,0,1)
      });

    });
    
    it('should be a diagonal quarto of filled pieces',function() {
      playAndTest({
        row: 3,
        column: 0,
        piece: new Piece(0,1,0,0)
      }, {
        row: 1,
        column: 2,
        piece: new Piece(1,1,0,1)
      }, {
        row: 2,
        column: 1,
        piece: new Piece(0,1,0,1)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(0,0,0,1)
      });

    });

    it('should be a row quarto of hollow pieces',function() {

            playAndTest({
        row: 3,
        column: 0,
        piece: new Piece(0,1,1,0)
      }, {
        row: 3,
        column: 1,
        piece: new Piece(0,1,1,0)
      }, {
        row: 3,
        column: 2,
        piece: new Piece(0,1,1,1)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(0,0,1,1)
      });

    });

    it('should be a column quarto of hollow pieces',function(){

      playAndTest({
        row: 2,
        column: 3,
        piece: new Piece(0,1,1,0)
      }, {
        row: 1,
        column: 3,
        piece: new Piece(0,0,1,0)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(0,1,1,1)
      }, {
        row: 3,
        column: 3,
        piece: new Piece(1,1,1,1)
      });

    });

    it('should be a diagonal quarto of hollow pieces', function(){

      playAndTest({
        row: 3,
        column: 0,
        piece: new Piece(0,0,1,0)
      }, {
        row: 2,
        column: 1,
        piece: new Piece(0,1,1,0)
      }, {
        row: 1,
        column: 2,
        piece: new Piece(0,1,1,1)
      }, {
        row: 0,
        column: 3,
        piece: new Piece(0,0,1,1)
      });

    });

  });


});