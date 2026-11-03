import Piece from './piece.js';

const SIZE = 4;

// Each trait a whole line can share. Order defines reporting order.
const TRAITS = [
  { name: 'light', test: (p) => p.isLight() },
  { name: 'dark', test: (p) => p.isDark() },
  { name: 'round', test: (p) => p.isRound() },
  { name: 'square', test: (p) => p.isSquare() },
  { name: 'short', test: (p) => p.isShort() },
  { name: 'tall', test: (p) => p.isTall() },
  { name: 'filled', test: (p) => p.isFilled() },
  { name: 'hollow', test: (p) => p.isHollow() },
];

function _range() {
  return Array.from({ length: SIZE }, (_, i) => i);
}

function _assertCoordinates(row, column) {
  if (!Number.isInteger(row) || !Number.isInteger(column) ||
      row < 0 || column < 0 || row >= SIZE || column >= SIZE) {
    throw new Error('coordinates are outside grid dimensions');
  }
}

// All lines (row, column and any diagonal) that pass through the given cell.
function _linesThrough(row, column) {
  const lines = [
    { line: 'row', cells: _range().map((c) => [row, c]) },
    { line: 'column', cells: _range().map((r) => [r, column]) },
  ];
  if (row === column) {
    lines.push({ line: 'diagonal', cells: _range().map((i) => [i, i]) });
  }
  if (row + column === SIZE - 1) {
    lines.push({ line: 'anti-diagonal', cells: _range().map((i) => [i, SIZE - 1 - i]) });
  }
  return lines;
}

// Traits shared by every piece of a full set; empty if the set is not full.
function _sharedTraits(set) {
  if (set.length !== SIZE || set.some((p) => !p)) return [];
  return TRAITS.filter((t) => set.every(t.test)).map((t) => t.name);
}

function _makeEvaluator(traitName) {
  return (set) => _sharedTraits(set).includes(traitName);
}

const Quarto = {
  phase: 0, // 0 => give a piece, 1 => play the given piece
  pieces: null,
  grid: null,
  selectedPiece: null,
  lastMove: null,
  canClaim: false,
  status: 'playing', // 'playing' | 'won' | 'draw'
  winningLines: null,

  start(pieces) {
    this.pieces = pieces ? pieces.slice() : Piece.makeAllPieces();
    this.phase = 0;
    this.grid = _range().map(() => new Array(SIZE).fill(null));
    this.selectedPiece = null;
    this.lastMove = null;
    this.canClaim = false;
    this.status = 'playing';
    this.winningLines = null;
    return this;
  },

  // ---- Board primitives (no turn rules) ----

  getPieceInGrid(row, column) {
    _assertCoordinates(row, column);
    return this.grid[row][column];
  },

  givePiece(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.pieces.length) {
      throw new Error('No such piece available');
    }
    return this.pieces.splice(index, 1)[0];
  },

  setPieceToGrid(row, column, piece) {
    if (!(piece instanceof Piece)) throw new Error(Piece.NOT_A_PIECE);
    _assertCoordinates(row, column);
    if (this.grid[row][column] !== null) {
      throw new Error('Slot is already populated');
    }
    this.grid[row][column] = piece;
    return piece;
  },

  // Quarto lines passing through the given cell, e.g.
  // [{ line: 'row', cells: [[0,0],...], properties: ['dark'] }]
  getQuartoLines(row, column) {
    _assertCoordinates(row, column);
    return _linesThrough(row, column)
      .map(({ line, cells }) => ({
        line,
        cells,
        properties: _sharedTraits(cells.map(([r, c]) => this.grid[r][c])),
      }))
      .filter((l) => l.properties.length > 0);
  },

  isQuarto(row, column) {
    return this.getQuartoLines(row, column).length > 0;
  },

  isBoardFull() {
    return this.grid.every((row) => row.every((cell) => cell !== null));
  },

  // ---- Turn flow (enforces the rules) ----

  // Give a piece (by Piece id) to the opponent. Closes the claim window.
  selectPiece(pieceId) {
    if (this.status !== 'playing') throw new Error('The game is over');
    if (this.phase !== 0) throw new Error('Place the selected piece first');
    const index = this.pieces.findIndex((p) => p.getId() === pieceId);
    if (index === -1) throw new Error('No such piece available');
    this.selectedPiece = this.givePiece(index);
    this.canClaim = false;
    this.phase = 1;
    return this.selectedPiece;
  },

  // Place the selected piece. Opens the claim window for this move only.
  placePiece(row, column) {
    if (this.status !== 'playing') throw new Error('The game is over');
    if (this.phase !== 1) throw new Error('Select a piece for the next player first');
    const piece = this.setPieceToGrid(row, column, this.selectedPiece);
    this.lastMove = { row, column, piece };
    this.selectedPiece = null;
    this.canClaim = true;
    this.phase = 0;
    return piece;
  },

  // Shout Quarto. Only lines through the piece just placed count, and only
  // before the next piece has been handed over. A missed Quarto is lost.
  // Returns { result: 'not-allowed' | 'no-quarto' | 'won' | 'draw', lines }
  claimQuarto() {
    if (this.status !== 'playing' || !this.canClaim) {
      return { result: 'not-allowed', lines: [] };
    }
    const { row, column } = this.lastMove;
    const lines = this.getQuartoLines(row, column);
    if (lines.length > 0) {
      this.status = 'won';
      this.winningLines = lines;
      this.canClaim = false;
      return { result: 'won', lines };
    }
    if (this.isBoardFull()) {
      this.status = 'draw';
      this.canClaim = false;
      return { result: 'draw', lines: [] };
    }
    return { result: 'no-quarto', lines: [] };
  },

  // With the board full there is no piece left to give: either shout
  // Quarto or accept the draw.
  declareDraw() {
    if (this.status !== 'playing' || !this.isBoardFull()) {
      throw new Error('A draw can only be declared when the board is full');
    }
    this.status = 'draw';
    this.canClaim = false;
    return this;
  },

  evaluators: {
    isLightSet: _makeEvaluator('light'),
    isDarkSet: _makeEvaluator('dark'),
    isRoundSet: _makeEvaluator('round'),
    isSquareSet: _makeEvaluator('square'),
    isShortSet: _makeEvaluator('short'),
    isTallSet: _makeEvaluator('tall'),
    isFilledSet: _makeEvaluator('filled'),
    isHollowSet: _makeEvaluator('hollow'),
  },
};

export default Quarto;
