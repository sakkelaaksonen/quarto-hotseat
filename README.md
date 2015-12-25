# Quarto 

## My five cents to gaming community

Simple Quarto implementation. Play Quarto with friends on same computer.

## How to play

Read [https://en.wikipedia.org/wiki/Quarto_%28board_game%29](Quarto Rules)

**Click** on a game piece to select the next piece to be played.

**Click** on a board cell to place selected piece on the board.
**Click** Quarto button when you want to declare Quarto.

**NOTE**

There is no concept of players in this implementation (yet).
Players should know who's turn it is. If not, maybe keep of the grass for a while, eh?

Also, unlike most implementations I have seen,in my game you really have to shout (click) Quarto. Most games will automatically declare a winner once first quarto is present on the game board. However, THIS IS WRONG. So I left it out. Being able to miss a quarto and continuing is essential part of the game IMHO.

## TODO: 
- Make it pretty pretty.
  - 3D pieces with colors instead of grayscale
  - Nice rounded 3D playfield
- Add piece descriptions to titles
- When Player shouts (clicks) Quarto, tell what kind of quarto it was
- Hilight Quarto row in grid
