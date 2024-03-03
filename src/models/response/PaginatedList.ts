export interface PaginatedList<T> {
    entities: T[];
    nextAt?: number | null
}