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
    id: string | undefined
    name: string
    image: string
    description: string
    regularPrice: string
    salePrice: string
    collectionId: number
    variantName: string[][]
    variantPrice: number[][] 
    variantType: string[],
    variantId: number[]
} 

export interface IRequestCollection {
    id: string
    name: string
    image: string
    productIds: number[]
} 

export interface productReq {
    productId: number,
    product: {
        id: number;
        name: string;
        image: string;
        description: string;
        regularPrice: string;
        salePrice: string;
        collection: {
            id: number;
            name: string;
        };
        variants: {
            id: number;
            title: string;
            value: string[];
            price: number[];
        }[];
    }
    variantInfo:{
        id: number[];
        index: number[];
    },
    productPrice: number,
    quantity: number,
}
