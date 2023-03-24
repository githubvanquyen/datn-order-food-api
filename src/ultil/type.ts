export interface IResponse {
    success: boolean
    data: any
    message: string
}

export interface IRequestProduct {
    id: number | undefined
    name: string
    images: string
    description: string
    variant: string
    regularPrice: string
    salePrice: string
} 