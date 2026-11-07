import { MESSAGES, TRAIT_NAMES } from './messages.js';
import Quarto from './quarto-engine.js';

// The UI only translates clicks into engine calls and renders engine state.
// All game rules live in quarto-engine.js.
const QuartoUI = {
  els: null,
  // Feedback or result shown in the status line instead of the instruction,
  // until the next successful action
  message: '',

  init() {
    Quarto.start();
    const $ = (selector) => document.querySelector(selector);
    this.els = {
      pieces: $('#js-pieces'),
      grid: $('#js-grid'),
      playbox: $('#js-playbox'),
      quarto: $('#js-quarto'),
      quartoHint: $('#js-quarto-hint'),
      help: $('#js-help'),
      helpOpen: $('#js-help-open'),
      status: $('#js-status'),
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
    this.initGridNavigation(this.els.pieces, '.js-piece');
    this.initGridNavigation(this.els.grid, '.js-grid-cell');
    this.els.quarto.addEventListener('click', () => this.shoutQuarto());
    this.els.helpOpen.addEventListener('click', () => this.els.help.showModal());
    // Q shouts Quarto from anywhere. Goes through the button, so whenever
    // the button is disabled (no shout allowed) Q does nothing either.
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

  // The board and the pool are 4 x 4 grids of buttons in row order, each a
  // single tab stop ("roving tabindex"): only one item is in the tab order,
  // arrow keys move focus inside the grid, Tab moves on. Whichever item gets
  // focus (arrows, click, or the jumps after picking/placing) becomes the
  // grid's tab stop.
  initGridNavigation(container, selector) {
    const items = () => [...container.querySelectorAll(selector)];
    container.addEventListener('keydown', (e) => this.moveInGrid(e, items()));
    container.addEventListener('focusin', (e) => {
      const item = e.target.closest(selector);
      if (item) this.setTabStop(items(), item);
    });
    this.setTabStop(items(), items()[0]);
  },

  // Used pool slots and occupied board cells are disabled: no clicks, and
  // arrows/Tab skip them. A disabled item cannot hold the grid's tab stop,
  // so it moves to the first item still enabled.
  disableGridItem(container, selector, item) {
    item.disabled = true;
    const items = [...container.querySelectorAll(selector)];
    const firstEnabled = items.find((i) => !i.disabled);
    if (firstEnabled) this.setTabStop(items, firstEnabled);
  },

  setTabStop(items, item) {
    for (const other of items) {
      other.tabIndex = other === item ? 0 : -1;
    }
  },

  // Moves in the arrow's direction, skipping disabled items (pool slots
  // whose piece is taken). Stops at the edges, no wrapping.
  moveInGrid(e, items) {
    const step = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }[e.key];
    const index = items.indexOf(e.target);
    // Leave browser/OS shortcuts such as Alt+Left alone
    if (!step || index === -1 || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    let row = Math.floor(index / 4);
    let column = index % 4;
    for (;;) {
      row += step[0];
      column += step[1];
      if (row < 0 || row > 3 || column < 0 || column > 3) return;
      const next = items[row * 4 + column];
      if (!next.disabled) {
        next.focus();
        return;
      }
    }
  },

  // Clones the piece markup from the round/square template in index.html.
  createPiece(piece) {
    const template = document.querySelector(piece.isRound() ? '#js-piece-round' : '#js-piece-square');
    const pieceEl = template.content.firstElementChild.cloneNode(true);
    pieceEl.classList.add(...piece.getPropertyString().split(' '));
    pieceEl.querySelector('.piece-label').textContent = piece.getPropertyString();
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
      this.disableGridItem(this.els.pieces, '.js-piece', slot);
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
      this.disableGridItem(this.els.grid, '.js-grid-cell', cell);
      // Next step is picking a piece; with none left (board full), it is
      // shouting Quarto
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
      // Just the shared traits, each once, e.g. "Quarto! Darks & Hollows"
      const traits = new Set(lines.flatMap((l) => l.properties));
      this.showMessage(MESSAGES.quarto([...traits].map((t) => TRAIT_NAMES[t]).join(' & ')));
    } else if (result === 'draw') {
      this.showMessage(MESSAGES.noQuartoDraw);
    } else if (result === 'no-quarto') {
      this.showMessage(MESSAGES.noQuarto);
    }
    // 'not-allowed' cannot happen: the button is disabled then (render)
    this.render();
  },

  cell(row, column) {
    return this.els.grid.querySelector(`[data-row="${row}"][data-column="${column}"]`);
  },

  // Shown on the next render(); '' goes back to the instruction
  showMessage(text) {
    this.message = text;
  },

  // One status line: the current message if there is one (errors, results),
  // otherwise what to do next. At game end the result message stays.
  render() {
    const playing = Quarto.status === 'playing';
    const boardFull = Quarto.isBoardFull();
    let text;
    // Read by screen readers only: which piece is to be played
    let spoken = '';
    if (this.message || !playing) {
      text = this.message;
    } else if (Quarto.phase === 1) {
      text = MESSAGES.playPiece;
      spoken = `: ${Quarto.selectedPiece.getPropertyString()}`;
    } else if (boardFull) {
      text = MESSAGES.boardFull;
    } else {
      text = MESSAGES.selectPiece;
    }
    // The status line is a live region: only touch it when the text changes,
    // so screen readers don't repeat it after every action
    if (this.els.status.textContent !== text + spoken) {
      const hidden = document.createElement('span');
      hidden.className = 'visually-hidden';
      hidden.textContent = spoken;
      this.els.status.replaceChildren(text, hidden);
    }
    // Quarto! only when a shout is allowed: right after placing a piece,
    // until the next piece is picked. While disabled mid-game, screen
    // readers get the reason as the button's description.
    const canShout = playing && Quarto.canClaim;
    this.els.quarto.disabled = !canShout;
    this.els.quartoHint.textContent = playing && !canShout ? MESSAGES.shoutTiming : '';
    document.body.classList.toggle('game-over', !playing);
    // Lets the CSS hint where the next tap goes: the pool or the board
    document.body.dataset.phase = !playing ? 'over' : Quarto.phase === 1 ? 'place' : 'give';
  },
};

document.addEventListener('DOMContentLoaded', () => QuartoUI.init());
