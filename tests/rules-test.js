import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Piece from '../piece.js';
import Quarto from '../quarto-engine.js';

const ALL_LINES = [
  ...[0, 1, 2, 3].map((r) => ({ line: 'row', cells: [0, 1, 2, 3].map((c) => [r, c]) })),
  ...[0, 1, 2, 3].map((c) => ({ line: 'column', cells: [0, 1, 2, 3].map((r) => [r, c]) })),
  { line: 'diagonal', cells: [[0, 0], [1, 1], [2, 2], [3, 3]] },
  { line: 'anti-diagonal', cells: [[0, 3], [1, 2], [2, 1], [3, 0]] },
];

// bit index in Piece id => [name when 0, name when 1]
const TRAIT_BITS = [['square', 'round'], ['short', 'tall'], ['filled', 'hollow'], ['light', 'dark']];

// Four distinct pieces that share exactly one trait (bit `bit` = `value`).
function piecesSharingOnly(bit, value) {
  return [0b000, 0b111, 0b001, 0b110].map((others) => {
    const low = others & ((1 << bit) - 1);
    const high = (others >> bit) << (bit + 1);
    return Piece.fromId(low | (value << bit) | high);
  });
}

// Full board with no quarto on any line (ids laid out row by row).
const DRAW_BOARD = [14, 2, 12, 9, 11, 1, 15, 4, 5, 10, 7, 13, 0, 6, 8, 3];

// Plays a whole turn via the rule-enforcing API.
function turn(pieceId, row, column) {
  Quarto.selectPiece(pieceId);
  Quarto.placePiece(row, column);
}

// Puts pieces (or piece ids) straight onto cells, bypassing turn rules.
function fill(cells, pieces) {
  for (const [i, [row, column]] of cells.entries()) {
    const piece = typeof pieces[i] === 'number' ? Piece.fromId(pieces[i]) : pieces[i];
    Quarto.setPieceToGrid(row, column, piece);
  }
}

// Cells of the whole board, row by row.
const BOARD_CELLS = [...Array(16).keys()].map((i) => [Math.floor(i / 4), i % 4]);

// Plays 16 full turns, filling the board row by row with the given ids.
function playBoard(ids) {
  for (const [i, [row, column]] of BOARD_CELLS.entries()) turn(ids[i], row, column);
}

describe('Piece ids', function() {
  it('should map all 16 pieces to unique ids 0-15 and back', function() {
    const ids = Piece.makeAllPieces().map((p) => p.getId()).sort((a, b) => a - b);
    assert.deepEqual(ids, [...Array(16).keys()]);
    for (const id of ids) assert.equal(Piece.fromId(id).getId(), id);
  });
});

describe('Quarto line detection', function() {
  describe('every line x every trait, with exactly one shared trait', function() {
    for (const { line, cells } of ALL_LINES) {
      for (const [bit, names] of TRAIT_BITS.entries()) {
        for (const value of [0, 1]) {
          const trait = names[value];
          it(`${trait} quarto on ${line} ${JSON.stringify(cells[0])}`, function() {
            Quarto.start();
            const pieces = piecesSharingOnly(bit, value);
            fill(cells, pieces);
            // Every cell of the line, used as the last move, sees this quarto.
            for (const [r, c] of cells) {
              const found = Quarto.getQuartoLines(r, c);
              assert.equal(found.length, 1);
              assert.equal(found[0].line, line);
              assert.deepEqual(found[0].properties, [trait]);
              assert.deepEqual(found[0].cells, cells);
            }
          });
        }
      }
    }
  });

  it('should report every trait a line shares', function() {
    Quarto.start();
    // ids 0, 2, 8, 10: all square and filled; height and color vary
    fill([[0, 0], [0, 1], [0, 2], [0, 3]], [0, 2, 8, 10]);
    const [found] = Quarto.getQuartoLines(0, 0);
    assert.deepEqual(found.properties.sort(), ['filled', 'square']);
  });

  it('should report two lines when one move completes both', function() {
    Quarto.start();
    const dark = [8, 9, 10, 11, 12, 13, 14];
    fill([[0, 0], [0, 1], [0, 2], [1, 3], [2, 3], [3, 3]], dark);
    Quarto.setPieceToGrid(0, 3, Piece.fromId(15));
    const found = Quarto.getQuartoLines(0, 3).map((l) => l.line).sort();
    assert.deepEqual(found, ['column', 'row']);
  });

  it('should not be a quarto when a line has only three pieces', function() {
    Quarto.start();
    fill([[0, 0], [0, 1], [0, 2]], [8, 9, 10]);
    assert.equal(Quarto.isQuarto(0, 2), false);
  });

  it('should not be a quarto when four pieces share no trait', function() {
    Quarto.start();
    // 0000 and 1111 differ on every bit, so nothing can be shared
    fill([[1, 0], [1, 1], [1, 2], [1, 3]], [0, 15, 3, 12]);
    for (let c = 0; c < 4; c++) assert.equal(Quarto.isQuarto(1, c), false);
  });

  it('should not see a diagonal quarto from a cell that is not on that diagonal', function() {
    Quarto.start();
    fill(ALL_LINES[9].cells, [8, 9, 10, 11]);
    Quarto.setPieceToGrid(0, 1, Piece.fromId(15));
    assert.equal(Quarto.isQuarto(0, 1), false);
    Quarto.setPieceToGrid(1, 1, Piece.fromId(14));
    assert.equal(Quarto.isQuarto(1, 1), false);
  });

  it('should not see an anti-diagonal quarto from the main diagonal and vice versa', function() {
    Quarto.start();
    fill(ALL_LINES[8].cells, [8, 9, 10, 11]);
    Quarto.setPieceToGrid(1, 2, Piece.fromId(0));
    assert.equal(Quarto.isQuarto(1, 2), false);
  });

  it('should find no quarto anywhere on a full draw board', function() {
    Quarto.start();
    fill(BOARD_CELLS, DRAW_BOARD);
    assert.equal(Quarto.isBoardFull(), true);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) assert.equal(Quarto.isQuarto(r, c), false);
    }
  });
});

describe('Turn flow and claiming', function() {
  beforeEach(function() {
    Quarto.start();
  });

  it('should start in the give phase with nothing to claim', function() {
    assert.equal(Quarto.phase, 0);
    assert.equal(Quarto.status, 'playing');
    assert.deepEqual(Quarto.claimQuarto(), { result: 'not-allowed', lines: [] });
    assert.equal(Quarto.status, 'playing');
  });

  it('should enforce give -> place order', function() {
    assert.throws(() => Quarto.placePiece(0, 0), /Select a piece/);
    Quarto.selectPiece(5);
    assert.equal(Quarto.phase, 1);
    assert.throws(() => Quarto.selectPiece(6), /Place the selected piece/);
    Quarto.placePiece(0, 0);
    assert.equal(Quarto.phase, 0);
    assert.equal(Quarto.getPieceInGrid(0, 0).getId(), 5);
  });

  it('should not allow giving a piece twice', function() {
    turn(5, 0, 0);
    assert.throws(() => Quarto.selectPiece(5), /No such piece/);
    assert.equal(Quarto.pieces.length, 15);
  });

  it('should reject placing on an occupied cell without changing the last move', function() {
    turn(8, 0, 0);
    Quarto.selectPiece(9);
    assert.throws(() => Quarto.placePiece(0, 0), /already populated/);
    assert.equal(Quarto.phase, 1);
    assert.equal(Quarto.selectedPiece.getId(), 9);
    assert.deepEqual([Quarto.lastMove.row, Quarto.lastMove.column], [0, 0]);
    Quarto.placePiece(0, 1);
    assert.deepEqual([Quarto.lastMove.row, Quarto.lastMove.column], [0, 1]);
  });

  it('should win when claiming right after completing a quarto', function() {
    turn(8, 0, 0);
    turn(9, 0, 1);
    turn(10, 0, 2);
    turn(11, 0, 3);
    const claim = Quarto.claimQuarto();
    assert.equal(claim.result, 'won');
    assert.equal(claim.lines[0].line, 'row');
    assert.ok(claim.lines[0].properties.includes('dark'));
    assert.equal(Quarto.status, 'won');
    assert.deepEqual(Quarto.winningLines, claim.lines);
    assert.throws(() => Quarto.selectPiece(0), /game is over/);
  });

  it('should forfeit a quarto once the next piece has been handed over', function() {
    turn(8, 0, 0);
    turn(9, 0, 1);
    turn(10, 0, 2);
    turn(11, 0, 3);
    Quarto.selectPiece(0); // missed it, handed over the next piece
    assert.equal(Quarto.claimQuarto().result, 'not-allowed');
    Quarto.placePiece(3, 3);
    // Opponent cannot claim the old line either: it does not pass through (3,3)
    assert.equal(Quarto.claimQuarto().result, 'no-quarto');
    assert.equal(Quarto.status, 'playing');
  });

  it('should not let an off-diagonal move claim a missed diagonal quarto', function() {
    turn(8, 3, 0);
    turn(9, 2, 1);
    turn(10, 1, 2);
    turn(11, 0, 3); // anti-diagonal of dark pieces, not claimed
    turn(0, 0, 1);
    assert.equal(Quarto.claimQuarto().result, 'no-quarto');
  });

  it('should keep the game going after a wrong claim', function() {
    turn(0, 0, 0);
    assert.equal(Quarto.claimQuarto().result, 'no-quarto');
    assert.equal(Quarto.status, 'playing');
    Quarto.selectPiece(1);
    Quarto.placePiece(1, 1);
  });

  it('should end in a draw when the board fills without a quarto', function() {
    playBoard(DRAW_BOARD);
    assert.equal(Quarto.pieces.length, 0);
    assert.equal(Quarto.claimQuarto().result, 'draw');
    assert.equal(Quarto.status, 'draw');
  });

  it('should allow declaring a draw only on a full board', function() {
    turn(0, 0, 0);
    assert.throws(() => Quarto.declareDraw(), /board is full/);
    Quarto.start();
    playBoard(DRAW_BOARD);
    Quarto.declareDraw();
    assert.equal(Quarto.status, 'draw');
  });

  it('should still allow winning with the very last piece', function() {
    // Start from the draw board and swap some piece into the last cell (3,3)
    // until the 16th move completes a quarto
    const board = DRAW_BOARD.slice();
    const lineFinder = () => {
      for (let a = 0; a < 16; a++) {
        const b = board.slice();
        [b[a], b[15]] = [b[15], b[a]];
        Quarto.start();
        playBoard(b);
        if (Quarto.isQuarto(3, 3)) return true;
      }
      return false;
    };
    assert.ok(lineFinder(), 'no winning last move found');
    assert.equal(Quarto.claimQuarto().result, 'won');
  });
});
