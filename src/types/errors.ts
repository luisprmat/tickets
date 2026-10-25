export type ErrorResponse = {
  message: string
}

export type ValidationErrors = Record<string, string[]>

export type ValidationErrorResponse = ErrorResponse & {
  errors: ValidationErrors
}
