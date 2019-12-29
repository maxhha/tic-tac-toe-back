export const createBoard = (room: Room) => {
  const order: string[]= room.users.reverse()
  const currentPlayer = order[0]
  const lastStep: BoardCell = {
    position: { x: 0, y: 0 },
    owner: order[1],
  }
  const cells: BoardCell[] = [ lastStep ]
  const possibleSteps: BoardPosition[] = [
    { x: -1, y:  1 },
    { x:  0, y:  1 },
    { x:  1, y:  1 },

    { x: -1, y:  0 },
    { x:  1, y:  0 },

    { x: -1, y: -1 },
    { x:  0, y: -1 },
    { x:  1, y: -1 },
  ]

  const board : Board = {
    order,
    cells,
    currentPlayer,
    possibleSteps,
    lastStep,
  }

  return board
}

const updateBoardWinner = (board: Board, cell: BoardCell): Board => {

  if (board.winner) {
    return board
  }

  const dx = [1, 1, 0, -1]
  const dy = [0, 1, 1, 1]

  let line: BoardPosition[]

  for(let i = 0; i < 4; i++){
    line = []

    for(let sign = -1; sign < 2; sign += 2) {
      for(let l = 1; l < 5 && line.length < 4; l++) {
         const p: BoardPosition = {
           x: cell.position.x + dx[i]*l*sign,
           y: cell.position.y + dy[i]*l*sign,
         }

         if (board.cells.find(c => (
           c.position.x === p.x
           && c.position.y === p.y
           && c.owner === cell.owner
         ))) {
           line.push(p)
         } else {
           break
         }
      }
    }

    if (line.length === 4) {
      line.push(cell.position)
      return {
        ...board,
        winner: cell.owner,
        winnerLine: line,
        currentPlayer: undefined,
      }
    }
  }

  return board
}

export const makeStep = (board: Board, cell: BoardCell ): Board => {
  if (board.currentPlayer !== cell.owner)
    throw new Error("Not order")

  const possibleStepIndex = board.possibleSteps.findIndex(
    pos => (
      pos.x === cell.position.x
      && pos.y === cell.position.y
    )
  )

  if (possibleStepIndex < 0)
    throw new Error("Inaccessible position")

  const oldPositions = [
    ...board.cells.map(c => c.position),
    ...board.possibleSteps
  ]

  const newBoard: Board = {
    ...board,
    cells: [
      ...board.cells,
      cell,
    ],
    lastStep: cell,
    possibleSteps: [
      ...board.possibleSteps.slice(0, possibleStepIndex),
      ...board.possibleSteps.slice(possibleStepIndex+1),
      ...[
        {x: cell.position.x - 1, y: cell.position.y + 1},
        {x: cell.position.x    , y: cell.position.y + 1},
        {x: cell.position.x + 1, y: cell.position.y + 1},

        {x: cell.position.x - 1, y: cell.position.y    },
        {x: cell.position.x + 1, y: cell.position.y    },

        {x: cell.position.x - 1, y: cell.position.y - 1},
        {x: cell.position.x    , y: cell.position.y - 1},
        {x: cell.position.x + 1, y: cell.position.y - 1},
      ].filter(
        pos => !oldPositions.find(
          p => p.x === pos.x && p.y === pos.y
        )
      ),
    ],
    currentPlayer: (
      board.order[
        (
          board.order.indexOf(board.currentPlayer)
          + 1
        ) % board.order.length
      ]
    ),
  }

  return updateBoardWinner(newBoard, cell)
}
