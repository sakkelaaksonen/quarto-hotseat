//TODO: what is this verbose shit i wrote? 
//All we need is function(a,b,c,d){return [a,b,c,d]}
//Once this is done,it's time to start code golfing this excessiveness.

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

Piece.prototype.getPropertyString = function(){
  return [
  !!this.shape ? 'round' : 'square',
  !!this.height ? 'tall' : 'short',
  !!this.hollow ? 'hollow' : 'filled',
  !!this.color ? 'dark' : 'light'
  ].join(' ');
}
Piece.prototype.getProperties = function() {
  return [this.shape, this.height, this.hollow, this.color];
}

Piece.prototype.isRound = function()  {
  return this.shape === 1;
}

Piece.prototype.isSquare = function()  {
  return this.shape === 0;
}

Piece.prototype.isTall = function()  {
  return this.height === 1;
}

Piece.prototype.isShort = function()  {
  return this.height === 0;
}

Piece.prototype.isHollow = function()  {
  return this.hollow === 1;
}

Piece.prototype.isFilled = function()  {
  return this.hollow === 0;
}

Piece.prototype.isDark = function()  {
  return this.color === 1;
}

Piece.prototype.isLight = function()  {
  return this.color === 0;
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

Piece.NOT_A_PIECE = 'what is this shit you are giving me man?!';
if (typeof module !== 'undefined') module.exports = Piece;