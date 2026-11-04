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
      help: $('#js-help'),
      helpOpen: $('#js-help-open'),
      text: $('#js-instructions'),
      message: $('#js-message'),
    };

    // Each pool slot is a button wrapping the piece. The slot stays in
    // place (disabled) when its piece is taken, so the pool never reflows.
    for (const piece of Quarto.pieces) {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'pool-slot js-piece';
      slot.dataset.pieceId = piece.getId();
      slot.setAttribute('aria-label', piece.getPropertyString());
      slot.appendChild(this.createPiece(piece));
      this.els.pieces.appendChild(slot);
    }

    this.els.pieces.addEventListener('click', (e) => this.givePiece(e));
    this.els.grid.addEventListener('click', (e) => this.setPiece(e));
    this.els.grid.addEventListener('keydown', (e) => this.moveOnBoard(e));
    // Whichever cell gets focus (arrows, click, or the jump after picking a
    // piece) becomes the board's single tab stop
    this.els.grid.addEventListener('focusin', (e) => {
      const cell = e.target.closest('.js-grid-cell');
      if (cell) this.setBoardTabStop(cell);
    });
    this.setBoardTabStop(this.cell(0, 0));
    this.els.quarto.addEventListener('click', () => this.shoutQuarto());
    this.els.draw.addEventListener('click', () => this.declareDraw());
    this.els.helpOpen.addEventListener('click', () => this.els.help.showModal());
    // Q shouts Quarto from anywhere. Goes through the button, so a disabled
    // button (game over) ignores it too.
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() !== 'q' || e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
      if (this.els.help.open) return;
      e.preventDefault();
      this.els.quarto.click();
    });
    // Tapping the backdrop (outside .help-content) closes the dialog
    this.els.help.addEventListener('click', (e) => {
      if (e.target === this.els.help) this.els.help.close();
    });

    this.render();
  },

  // The board is one tab stop ("roving tabindex"): only one cell is in the
  // tab order, arrow keys move focus between cells, Tab leaves the board.
  setBoardTabStop(cell) {
    for (const other of this.els.grid.querySelectorAll('.js-grid-cell')) {
      other.tabIndex = other === cell ? 0 : -1;
    }
  },

  moveOnBoard(e) {
    const step = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }[e.key];
    const cell = e.target.closest('.js-grid-cell');
    // Leave browser/OS shortcuts such as Alt+Left alone
    if (!step || !cell || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    // Stop at the edges, no wrapping
    const clamp = (n) => Math.min(3, Math.max(0, n));
    const row = clamp(Number(cell.dataset.row) + step[0]);
    const column = clamp(Number(cell.dataset.column) + step[1]);
    this.cell(row, column).focus();
  },

  // Clones the piece markup from the round/square template in index.html.
  createPiece(piece) {
    const template = document.querySelector(piece.isRound() ? '#js-piece-round' : '#js-piece-square');
    const pieceEl = template.content.firstElementChild.cloneNode(true);
    pieceEl.classList.add(...piece.getPropertyString().split(' '));
    if (!piece.isHollow()) pieceEl.querySelector('.piece-hole').remove();
    return pieceEl;
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
    const slot = e.target.closest('.js-piece');
    if (!slot) return;
    this.attempt(() => {
      Quarto.selectPiece(Number(slot.dataset.pieceId));
      this.els.playbox.appendChild(slot.firstElementChild);
      slot.disabled = true;
      // The focused slot is now disabled; continue on the board instead
      this.els.grid.querySelector('.grid-cell:empty')?.focus();
    });
  },

  setPiece(e) {
    const cell = e.target.closest('.js-grid-cell');
    if (!cell) return;
    this.attempt(() => {
      Quarto.placePiece(Number(cell.dataset.row), Number(cell.dataset.column));
      const pieceEl = this.els.playbox.firstElementChild;
      cell.appendChild(pieceEl);
      cell.setAttribute('aria-label', `${cell.getAttribute('aria-label')}: ${pieceEl.className.replace('piece ', '')}`);
      // Next step is picking a piece; with none left (board full), it is
      // shouting Quarto or calling a draw
      const nextSlot = this.els.pieces.querySelector('.pool-slot:not(:disabled)');
      (nextSlot ?? this.els.quarto).focus();
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
    // Lets the CSS hint where the next tap goes: the pool or the board
    document.body.dataset.phase = !playing ? 'over' : Quarto.phase === 1 ? 'place' : 'give';
  },
};

document.addEventListener('DOMContentLoaded', () => QuartoUI.init());
