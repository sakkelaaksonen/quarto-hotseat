import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Piece from '../piece.js';
import Quarto from '../quarto-engine.js';

function playAndTest(move1, move2, move3, move4) {
  Quarto.start();
  Quarto.setPieceToGrid(move1.row, move1.column, move1.piece);
  Quarto.setPieceToGrid(move2.row, move2.column, move2.piece);
  Quarto.setPieceToGrid(move3.row, move3.column, move3.piece);
  const lastPiece = move4.piece;
  Quarto.setPieceToGrid(move4.row, move4.column, lastPiece);
  assert.equal(Quarto.isQuarto(lastPiece, move4.row, move4.column), true);
}

describe('Quarto Game Engine', function() {

  describe('Piece.getPropertyString', function() {
    it('should give a string containing "light square short filled"', function() {
      const s = new Piece(0, 0, 0, 0).getPropertyString();
      assert.match(s, /light/);
      assert.match(s, /square/);
      assert.match(s, /filled/);
      assert.match(s, /short/);
    });

    it('should give a string containing "dark round tall hollow"', function() {
      const s = new Piece(1, 1, 1, 1).getPropertyString();
      assert.match(s, /dark/);
      assert.match(s, /round/);
      assert.match(s, /hollow/);
      assert.match(s, /tall/);
    });
  });

  describe('Quarto.start', function() {
    it('should make all pieces and set phase to 0', function() {
      Quarto.start();
      assert.equal(Quarto.phase, 0);
      assert.equal(Quarto.pieces.length, 16);
    });

    it('should reset the grid', function() {
      Quarto.grid[0][0] = 1;
      assert.notEqual(Quarto.start().grid[0][0], 1);
    });
  });

  describe('Quarto.givePiece', function() {
    it('should remove a piece from list with given index', function() {
      Quarto.start();
      assert.ok(Quarto.givePiece(15) instanceof Piece);
      assert.equal(Quarto.pieces.length, 15);
      assert.ok(Quarto.givePiece(1) instanceof Piece);
      assert.equal(Quarto.pieces.length, 14);
      assert.ok(Quarto.givePiece(6) instanceof Piece);
      assert.equal(Quarto.pieces.length, 13);
    });
  });

  describe('Quarto.setPiece & Quarto.getPiece', function() {
    it('should set a piece to given grid cell and get that same piece from that same cell', function() {
      Quarto.start();
      const thePiece = Quarto.givePiece(0);
      assert.equal(Quarto.setPieceToGrid(0, 0, thePiece), thePiece);
    });

    it('should not allow replacing a piece in already occupied slot', function() {
      Quarto.start();
      for (const [row, column] of [[0, 0], [1, 0], [1, 1]]) {
        const piece = Quarto.givePiece(0);
        assert.equal(Quarto.setPieceToGrid(row, column, piece), piece);
        assert.throws(() => Quarto.setPieceToGrid(row, column, Quarto.givePiece(0)), /already populated/);
      }
    });
  });

  describe('Quarto.evaluators.isDarkSet',function(){
    it('should be a dark set',function(){
        assert.equal(Quarto.evaluators.isDarkSet([
          new Piece(0,0,0,1),
          new Piece(1,0,0,1),
          new Piece(0,1,0,1),
          new Piece(1,1,1,1)
          ]), true);

          assert.equal(Quarto.evaluators.isDarkSet([
          new Piece(1,0,0,1),
          new Piece(1,1,0,1),
          new Piece(0,0,0,1),
          new Piece(1,0,1,1)
          ]), true);
    })
  });

  describe('Quarto.evaluators.isLightSet',function(){
    it('should be a light set',function(){
        assert.equal(Quarto.evaluators.isLightSet([
          new Piece(0,0,0,0),
          new Piece(1,0,0,0),
          new Piece(0,1,0,0),
          new Piece(1,1,1,0)
          ]), true);

          assert.equal(Quarto.evaluators.isLightSet([
          new Piece(1,0,0,0),
          new Piece(1,1,0,0),
          new Piece(0,0,0,0),
          new Piece(1,0,1,0)
          ]), true);
    })
  });


  describe('Quarto.evaluators.isRoundSet',function(){
    it('should be a round set',function(){
        assert.equal(Quarto.evaluators.isRoundSet([
          new Piece(1,0,0,1),
          new Piece(1,0,0,0),
          new Piece(1,1,0,1),
          new Piece(1,1,1,0)
          ]), true);

          assert.equal(Quarto.evaluators.isRoundSet([
          new Piece(1,0,0,1),
          new Piece(1,1,0,1),
          new Piece(1,0,1,1),
          new Piece(1,1,1,1)
          ]), true);
    })
  });

  describe('Quarto.evaluators.isSquareSet',function(){
    it('should be a square set',function(){
        assert.equal(Quarto.evaluators.isSquareSet([
          new Piece(0,1,1,1),
          new Piece(0,0,0,1),
          new Piece(0,1,0,1),
          new Piece(0,1,1,0)
          ]), true);

          assert.equal(Quarto.evaluators.isSquareSet([
          new Piece(0,1,0,1),
          new Piece(0,1,0,0),
          new Piece(0,0,0,1),
          new Piece(0,0,1,1)
          ]), true);
    })
  });

  describe('Quarto.evaluators.isTallSet',function(){
    it('should be a tall set',function(){
        assert.equal(Quarto.evaluators.isTallSet([
          new Piece(0,1,0,1),
          new Piece(1,1,0,1),
          new Piece(0,1,0,1),
          new Piece(1,1,1,1)
          ]), true);

          assert.equal(Quarto.evaluators.isTallSet([
          new Piece(1,1,0,1),
          new Piece(1,1,0,0),
          new Piece(0,1,0,1),
          new Piece(1,1,0,0)
          ]), true);
    })
  });

describe('Quarto.evaluators.isShortSet',function(){
    it('should be a short set',function(){
        assert.equal(Quarto.evaluators.isShortSet([
          new Piece(1,0,0,0),
          new Piece(1,0,0,1),
          new Piece(0,0,0,1),
          new Piece(1,0,1,1)
          ]), true);

          assert.equal(Quarto.evaluators.isShortSet([
          new Piece(0,0,1,1),
          new Piece(0,0,0,0),
          new Piece(0,0,0,1),
          new Piece(1,0,1,1)
          ]), true);
    })
  });


describe('Quarto.evaluators.isFilledSet',function(){
    it('should be a dark set',function(){
        assert.equal(Quarto.evaluators.isFilledSet([
          new Piece(0,0,0,1),
          new Piece(1,0,0,1),
          new Piece(0,1,0,1),
          new Piece(1,1,0,1)
          ]), true);

          assert.equal(Quarto.evaluators.isFilledSet([
          new Piece(0,0,0,0),
          new Piece(1,1,0,1),
          new Piece(0,0,0,1),
          new Piece(1,0,0,1)
          ]), true);
    })
  });

describe('Quarto.evaluators.isHollowSet',function(){
    it('should be a dark set',function(){
        assert.equal(Quarto.evaluators.isHollowSet([
          new Piece(0,0,1,1),
          new Piece(1,0,1,1),
          new Piece(0,1,1,1),
          new Piece(1,1,1,1)
          ]), true);

          assert.equal(Quarto.evaluators.isHollowSet([
          new Piece(1,0,1,1),
          new Piece(1,1,1,1),
          new Piece(0,0,1,1),
          new Piece(1,0,1,1)
          ]), true);
    })
  });


  describe('Quarto.isQuarto', function() {
    it('should reject a missing piece and find no quarto on an empty grid', function() {
      Quarto.start();
      assert.throws(() => Quarto.isQuarto(null, null, null), { message: Piece.NOT_A_PIECE });
      assert.equal(Quarto.isQuarto(new Piece(0, 0, 0, 0), 0, 0), false);
    });


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