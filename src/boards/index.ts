export const createBoard = (room: Room) => {
  const order: string[]= room.users.reverse()
  const currentPlayer = order[1]
  const cells: BoardCell[] = [
    {
      position: { x: 0, y: 0 },
      owner: order[0],
    }
  ]
  const possibleSteps: BoardPosition[] = [
    { x:  1, y:  0 },
    { x:  0, y: -1 },
    { x: -1, y:  0 },
    { x:  0, y:  1 },
  ]

  const board : Board = {
    order,
    cells,
    currentPlayer,
    possibleSteps,
  }

  return board
}
