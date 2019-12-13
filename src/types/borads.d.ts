
interface BoardPosition {
  x: number,
  y: number,
}

interface BoardCell {
  position: BoardPosition,
  owner: string,
}

interface Board {
  cells: BoardCell[],
  possibleSteps: BoardPosition[],
  lastStep?: BoardCell,
  winner?: string,
  currentPlayer?: string,
  order: string[],
}
