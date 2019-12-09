const ID_LENGTH = 6 // max 9

export const generateID = () => {
  return Math.random().toString(36).substr(2, ID_LENGTH)
}
