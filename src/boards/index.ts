export const createBoard = (room: Room) => (
  {
    cells: [],
    order: room.users.reverse(),
    currentPlayer: room.users[room.users.length - 1],
  }
)
