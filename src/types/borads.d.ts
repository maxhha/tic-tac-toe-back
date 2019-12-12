
interface BoardCell {
  x: number,
  y: number,
  owner: string
}

interface Board {
  cells: BoardCell[],
  lastStep?: BoardCell,
  winner?: string,
  currentPlayer?: string,
  order: string[],
}
