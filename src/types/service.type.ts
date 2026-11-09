export type ServiceSuccess<T> = {
    success: true
    message : string
    data: T
}

export type ServiceError = {
    success: false
    message: string
    errors?: Record<string, string[]>
}

export type ServiceResponse<T> = {
    data: ServiceSuccess<T> | ServiceError
    status: number
}