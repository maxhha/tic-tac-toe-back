import path from 'path'
import { readFileSync } from "fs"
import { sign, verify } from "jsonwebtoken"

const secret = readFileSync(path.join(__dirname, "../../jwt/secret.key"))

export interface TokenPayload {
  uid: string,
}

export const createToken = (payload : TokenPayload) => (
  sign(payload, secret)
)

export const verifyToken = (token : string) => {
  try {
    return verify(token, secret) as TokenPayload
  } catch {
    return
  }
}
