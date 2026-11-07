// Texts shown in the status line, in one place for easy editing.
// Rule violations reported by the engine (quarto-engine.js) are shown as-is.

export const MESSAGES = {
  // What to do next
  selectPiece: 'Select a piece',
  playPiece: 'Play the piece',
  boardFull: 'Board is full.',

  // Shouting Quarto
  quarto: (traits) => `Quarto of ${traits}`,
  noQuarto: 'No Quarto there',
  noQuartoDraw: 'No Quarto. Draw',
  // Screen readers only: why the Quarto! button is disabled
  shoutTiming: 'Shout Quarto after placing a piece',
};

// Shared traits in the win message, e.g. "Quarto! Darks & Hollows"
export const TRAIT_NAMES = {
  light: 'Lights',
  dark: 'Darks',
  round: 'Rounds',
  square: 'Squares',
  short: 'Shorts',
  tall: 'Talls',
  filled: 'Filled',
  hollow: 'Hollows',
};
