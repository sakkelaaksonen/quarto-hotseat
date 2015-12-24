
var QuartoUI = (function(Quarto) {

  //events
  // Game starts
  // Player selects piece
  // Player plays piece
  // Player declares Quarto

  return {
    lastMove: {
      row: null,
      column: null,
      piece: null
    },
    init: function() {

      //Bind events
      //gamePieces.on('click','.piece',givePiece)
      document
        .querySelector('#js-pieces')

        .addEventListener('click', this.givePiece, true);


      document
        .querySelector('#js-grid')
        .addEventListener('click', this.setPiece, true);

      //quartoButton.on('click',isQuarto)
    },
    givePiece: function(e) {
      console.log(e);
      if (Quarto.phase !== 0) {
        console.log('Set your piece first...');
        return false;
      }
      Quarto.phase = 1;
      return this;
      //Move piece from piecebox to playbox
    },
    setPiece: function(e) {
      console.log(e);
      if (Quarto.phase !== 1) {
        console.log('Give a piece to player first...');
        return false;
      }

      var coords = e.target.id.split('-');
      coords.shift(); //discard 'cell'
      //TODO better grid tokenizing. Not bad but could be better.

      console.log(coords);
      Quarto.phase = 0;
      //move piece from playbox to grid
    },
    shoutQuarto: function() {
      if (Quarto.isQuarto(this.lastMove.row, this.lastMove.column, this.lastMove.piece)) {
        if (confirm('You Win!')) {
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