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
      button: '#js-quarto'
    },
    lastMove: {
      row: null,
      column: null,
      piece: null
      // pieceIndex:null,
    },
    init: function() {
      Quarto.start();
      //Bind events
      //gamePieces.on('click','.piece',givePiece)
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
      // console.log(e);
      var thePiece = e.originalTarget;
      if (Quarto.phase !== 0) {
        console.log('Set your piece first...');
        return false;
      }


      var pieceIndex = 0;
      var sibling = thePiece; //Just a temp var
      while( (sibling = sibling.previousSibling) != null ) {
        // console.log(pieceIndex, child);
        pieceIndex++;
      }
      // console.log(pieceIndex);
      document
        .querySelector(this.selectors.playbox)
        .appendChild(thePiece);

      this.lastMove.piece = Quarto.givePiece(pieceIndex);
      Quarto.phase = 1;

      return this;
      
    },
    setPiece: function(e) {
      
      if (Quarto.phase !== 1) {
        console.log('Give a piece to player first...');
        return false;
      }

      var theSlot = e.originalTarget;
      var thePiece = document.querySelector(this.selectors.playbox).children.item(0);
      var coords = theSlot.id.split('-');
      coords.shift(); //discard 'cell'
      //TODO better grid tokenizer. Not bad but could be better.
      this.lastMove.row = coords.shift();
      this.lastMove.column = coords.shift();
      //move piece from playbox to grid
      theSlot.appendChild(thePiece);
      Quarto.setPieceToGrid(this.lastMove.row, this.lastMove.column, this.lastMove.piece); 
      Quarto.phase = 0;
      return this;

    },
    shoutQuarto: function() {
      console.log(this.lastMove)
      if (Quarto.isQuarto(this.lastMove.piece,this.lastMove.row, this.lastMove.column )) {
        if (confirm('You Win!')) {
          //easy way out...
          window.location.reload();

  
          //TODO
          // QuartoUI.reset/init/whatever();
          //  =>  Quarto.start()
        };

      }
      return this;
    }

  };

})(Quarto);

document.addEventListener("DOMContentLoaded", function(event) {
  QuartoUI.init();
});