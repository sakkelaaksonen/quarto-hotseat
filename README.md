# Quarto

## My five cents to gaming community

Simple Quarto implementation. Play Quarto with friends on same computer.

## How to play

Read [Quarto Rules](https://en.wikipedia.org/wiki/Quarto_%28board_game%29)

**Click** on a game piece to select the next piece to be played.

**Click** on a board cell to place selected piece on the board.

**Click** Quarto button when you want to declare Quarto. A Quarto can only be
claimed right after placing the piece that completes it, before handing over
the next piece. Once the next piece is given, that Quarto is lost.

When the board is full, shout Quarto or click **Draw**.

**NOTE**


Players should know who's turn it is. 
Also, unlike most implementations I have seen,in my game you really have to shout (**click**) Quarto. Most games will automatically declare a winner once first quarto is present on the game board. However, this is not in the spirit of the game. So I left it out. Being able to miss a quarto and continuing is essential part of the game IMHO.


## Development

No build step. The game uses native ES modules, so it must be served over HTTP
(opening `index.html` via `file://` will not work):

    npm run serve        # python3 -m http.server 8000 → http://localhost:8000

Requires Node 22+ for tooling:

    npm install
    npm test             # node:test
    npm run lint         # biome

## DEV LOG

- 2.12.2024 
    - Migration from now/zeit to Github Pages
    - https://sakkelaaksonen.github.io/quarto-hotseat/
    - npm audit fix
    - Some quarto cases are not correctly recognized. Needs fixes.

- 3.11.2026
    - Native ES modules, node:test, Biome, GitHub Actions CI
    - Fixed: diagonals checked from cells not on them, Quarto claimable after
      handing over the next piece, crash when shouting before the first move,
      occupied-cell clicks corrupting the last move
    - Draw detection, winning line highlight, Quarto type shown on win
    - New layout for tablets and phones lying flat on a table: always
      landscape (rotated in portrait), board left, controls and pieces right,
      scales to the screen, touch friendly, pieces and cells are buttons
    - 3D look in pure CSS on a flat tilted board (no preserve-3d, which broke
      click hit-testing): square board cells, all pieces share one footprint
      and differ by real height, recessed holes, rounded square pieces,
      selected piece shown on its own board-style cell
    - Piece markup lives in `<template>`s in index.html
    - The piece pool is shuffled every game on purpose, so the board can't be
      read from memorised positions

