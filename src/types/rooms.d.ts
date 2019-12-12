interface Room {
  id: string,
  name: string,
  users: string[],
  createdAt: Date,
  gameActive: boolean,
  updatedAt: Date,
  board?: Board,
}

interface RoomsDatabase {
  [id: string]: Room
}
