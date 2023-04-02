export interface IResponse {
    success: boolean
    data: any
    message: string
    error: {
        field: string
        message: string
    }
}

export interface IRequestProduct {
    id: number | undefined
    name: string
    image: string
    description: string
    regularPrice: string
    salePrice: string
} 