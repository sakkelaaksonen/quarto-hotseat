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

    it('should reset the grid',function(){
      Quarto.grid[0][0] = 1;
      expect(Quarto.start().grid[0][0]).not.to.equal(1);

    });
  });

  beforeEach(function(){
    Quarto.start();    
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


  describe('Quarto.setPiece & Quarto.getPiece',function(){
    it('should set a piece to given grid cell and get that same piece from that same cell',function(){
  
      var thePiece = Quarto.givePiece(0);
      // expect(Quarto.getElementsByTagName(''))
      // Quarto.setPieceToGrid(0,0,thePiece);
      expect(Quarto.setPieceToGrid.bind(Quarto,0,0,{a:1})).to.throw(/this shit/);
      expect(Quarto.setPieceToGrid(0,0,thePiece)).to.equal(thePiece);
      expect(Quarto.getPieceInGrid.bind(Quarto,5,5)).to.throw(/coordinates/);
    });
  });



  // Quarto.setPieceToGrid(0, 0, Quarto.givePiece(1));
  // Quarto.setPieceToGrid(1, 0, Quarto.givePiece(4));
  // Quarto.setPieceToGrid(2, 0, Quarto.givePiece(6));
  // var lastPiece = Quarto.givePiece(8);
  // Quarto.setPieceToGrid(3, 0, lastPiece);

  // console.log(
  //   Quarto.isQuarto(lastPiece, 3, 0)
  // );


});