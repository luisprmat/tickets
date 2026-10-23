export type PaginationLinks = {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export type PaginationMetaLink = {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export type PaginationMeta = {
  current_page: number
  from: number
  to: number
  per_page: number
  total: number
  last_page: number
  links: PaginationMetaLink[]
}

export type Paginated<T> = {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}
