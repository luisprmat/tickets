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

export type ErrorResponse = {
  message: string
}

export type ValidationErrors = Record<string, string[]>

export type ValidationErrorResponse = ErrorResponse & {
  errors: ValidationErrors
}
