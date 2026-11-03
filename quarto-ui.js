import Quarto from './quarto-engine.js';

// The UI only translates clicks into engine calls and renders engine state.
// All game rules live in quarto-engine.js.
const QuartoUI = {
  els: null,

  init() {
    Quarto.start();
    const $ = (selector) => document.querySelector(selector);
    this.els = {
      pieces: $('#js-pieces'),
      grid: $('#js-grid'),
      playbox: $('#js-playbox'),
      quarto: $('#js-quarto'),
      draw: $('#js-draw'),
      text: $('#js-instructions'),
      message: $('#js-message'),
    };

    for (const piece of Quarto.pieces) {
      const pieceEl = document.createElement('div');
      pieceEl.className = `piece js-piece ${piece.getPropertyString()}`;
      pieceEl.title = piece.getPropertyString();
      pieceEl.dataset.pieceId = piece.getId();
      this.els.pieces.appendChild(pieceEl);
    }

    this.els.pieces.addEventListener('click', (e) => this.givePiece(e));
    this.els.grid.addEventListener('click', (e) => this.setPiece(e));
    this.els.quarto.addEventListener('click', () => this.shoutQuarto());
    this.els.draw.addEventListener('click', () => this.declareDraw());

    this.render();
  },

  // Runs an engine action; rule violations are shown to the player.
  attempt(action) {
    try {
      action();
      this.showMessage('');
    } catch (err) {
      this.showMessage(err.message);
    }
    this.render();
  },

  givePiece(e) {
    const pieceEl = e.target.closest('.js-piece');
    if (!pieceEl) return;
    this.attempt(() => {
      Quarto.selectPiece(Number(pieceEl.dataset.pieceId));
      this.els.playbox.appendChild(pieceEl);
    });
  },

  setPiece(e) {
    const cell = e.target.closest('.js-grid-cell');
    if (!cell) return;
    this.attempt(() => {
      Quarto.placePiece(Number(cell.dataset.row), Number(cell.dataset.column));
      cell.appendChild(this.els.playbox.firstElementChild);
    });
  },

  shoutQuarto() {
    const { result, lines } = Quarto.claimQuarto();
    if (result === 'won') {
      for (const { cells } of lines) {
        for (const [row, column] of cells) {
          this.cell(row, column).classList.add('winning');
        }
      }
      const kinds = lines.map((l) => `${l.properties.join(' & ')} ${l.line}`).join(', ');
      this.showMessage(`Quarto! ${kinds}. You win!`);
    } else if (result === 'draw') {
      this.showMessage('No Quarto there, and the board is full. It is a draw.');
    } else if (result === 'no-quarto') {
      this.showMessage('No Quarto there.');
    } else {
      this.showMessage('Quarto can only be shouted right after placing a piece.');
    }
    this.render();
  },

  declareDraw() {
    this.attempt(() => Quarto.declareDraw());
    if (Quarto.status === 'draw') this.showMessage('It is a draw.');
  },

  cell(row, column) {
    return this.els.grid.querySelector(`[data-row="${row}"][data-column="${column}"]`);
  },

  showMessage(text) {
    this.els.message.textContent = text;
  },

  render() {
    const playing = Quarto.status === 'playing';
    const boardFull = Quarto.isBoardFull();
    let text;
    if (!playing) {
      text = 'Game over. Press Restart to play again.';
    } else if (Quarto.phase === 1) {
      text = 'Play the selected piece';
    } else if (boardFull) {
      text = 'Board is full: shout Quarto, or call it a draw';
    } else {
      text = 'Select a piece for next player';
    }
    this.els.text.textContent = text;
    this.els.quarto.disabled = !playing;
    this.els.draw.hidden = !(playing && boardFull);
    document.body.classList.toggle('game-over', !playing);
  },
};

document.addEventListener('DOMContentLoaded', () => QuartoUI.init());
