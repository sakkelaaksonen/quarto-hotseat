var QuartoUI = (function(Quarto) {


  //events
  // Game starts
  // Player selects piece
  // Player plays piece
  // Player declares Quarto

  return {
    selectors: {
      playbox: '#js-playbox',
      grid: '#js-grid',
      pieces: '#js-pieces',
      button: '#js-quarto',
      gridCell:'.js-grid-cell',
      piece: '.js-piece',
      text:'#js-instructions'

    },
    lastMove: {
      row: null,
      column: null,
      piece: null
      // pieceIndex:null,
    },
    gameOver:false,
    init: function() {
      Quarto.start();
      //Bind events
      var piecesDOM = document
        .querySelector(this.selectors.pieces);
      
        piecesDOM.addEventListener('click', this.givePiece.bind(this), true);
        Quarto.pieces.map(function(piece){
          var pieceDOM = document.createElement('div');
          pieceDOM.className = 'piece js-piece ' + piece.getPropertyString();
          piecesDOM.appendChild(pieceDOM);
        });

      document
        .querySelector(this.selectors.grid)
        .addEventListener('click', this.setPiece.bind(this), true);

      document
        .querySelector(this.selectors.button)
        .addEventListener('click',this.shoutQuarto.bind(this),true);

      
    },
    givePiece: function(e) {
      //Move piece from piecebox to playbox
      
      console.log(e);
      if(this.gameOver) {
        return false;
      }

      // if(e.originalTarget){
      var thePiece = (e.originalTarget || e.srcElement);
      // } else if (e.toElement) {
      //       var thePiece = e.toElement;
      // }
      // else {
      //   alert('wtf');
      // }
      console.log(thePiece.className);
      
      if(! /js-piece/.test(thePiece.className))  {
        console.log('not a game piece');
        return false;
      }
      if (Quarto.phase !== 0) {
        console.log('Set your piece first...');
        return false;
      }


      var pieceIndex = 0;
      var sibling = thePiece; //Just a temp var
      while( (sibling = sibling.previousSibling) != null ) {
        // console.log(pieceIndex, sibling);
        pieceIndex++;
      }
      // console.log(pieceIndex);
      document
        .querySelector(this.selectors.playbox)
        .appendChild(thePiece);

      this.lastMove.piece = Quarto.givePiece(pieceIndex);
      Quarto.phase = 1;
      this.toggleText();
      return this;
      
    },
    setPiece: function(e) {
       if(this.gameOver) {
        return false;
      }

      if (Quarto.phase !== 1) {
        console.log('Give a piece to player first...');
        return false;
      }

      var theSlot = (e.originalTarget || e.srcElement);

      if( !/js-grid-cell/.test(theSlot.className) )  {
        console.log('Not a grid cell');
        return false;
      }
      var thePiece = document
                      .querySelector(this.selectors.playbox)
                      .children.item(0);
      //TODO better grid tokenizer. Not bad but could be better.
      var coords = theSlot.id.split('-');
      coords.shift(); //discard 'cell'
      this.lastMove.row = coords.shift();
      this.lastMove.column = coords.shift();
      //move piece from playbox to grid
      try{
        Quarto.setPieceToGrid(this.lastMove.row, this.lastMove.column, this.lastMove.piece); 
      } catch(e) {
        alert('Can you not see there is already a piece on that slot');
        return this;
      }

      theSlot.appendChild(thePiece);
      
      Quarto.phase = 0;
      this.toggleText();
      return this;
    },
    toggleText:function(){
      var textNode = document.querySelector(this.selectors.text);      
      textNode.classList.toggle('select');
      textNode.classList.toggle('play');
      
      return this;

    },
    shoutQuarto: function() {
      console.log(this.lastMove)
      if (Quarto.isQuarto(this.lastMove.piece,this.lastMove.row, this.lastMove.column )) {
        this.gameOver = true;
        if (confirm("You Win!\n Do you want to play another round?")) {
          //easy way out...
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