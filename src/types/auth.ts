export type User = {
  id: number
  name: string
  email: string
}

export type UserResponse = {
  data: User
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}
