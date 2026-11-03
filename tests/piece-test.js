import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Piece from '../piece.js';

describe('Piece', function() {

  it('should make all pieces with Piece.makeAllPieces', function() {
    const props = Piece.makeAllPieces().map((p) => p.getPropertyString());
    assert.equal(props.length, 16);
    assert.equal(new Set(props).size, 16);
  });

  it('should return the properties given in constructor with getProperties', function() {
    assert.deepEqual(new Piece(0, 0, 0, 0).getProperties(), [0, 0, 0, 0]);
  });

  it('should make a square short filled light piece', function() {
    const p = new Piece(0, 0, 0, 0);

    assert.equal(p.isLight(), true);
    assert.equal(p.isShort(), true);
    assert.equal(p.isFilled(), true);
    assert.equal(p.isSquare(), true);

    assert.equal(p.isTall(), false);
    assert.equal(p.isRound(), false);
    assert.equal(p.isHollow(), false);
    assert.equal(p.isDark(), false);
  });

  it('should make a round tall dark hollow piece', function() {
    const p = new Piece(1, 1, 1, 1);

    assert.equal(p.isDark(), true);
    assert.equal(p.isRound(), true);
    assert.equal(p.isHollow(), true);
    assert.equal(p.isTall(), true);

    assert.equal(p.isLight(), false);
    assert.equal(p.isShort(), false);
    assert.equal(p.isFilled(), false);
    assert.equal(p.isSquare(), false);
  });

});
