var expect = require('chai').expect;
var Piece = require('../piece.js');


//TODO: Make pieces-test.js
describe('Piece', function() {

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
