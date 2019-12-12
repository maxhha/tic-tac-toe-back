interface Room {
  id: string,
  name: string,
  users: User[],
  createdAt: Date,
  active: boolean;
}

interface RoomsDatabase {
  [id: string]: Room
}
