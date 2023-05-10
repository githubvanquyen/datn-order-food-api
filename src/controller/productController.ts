import { Request, Response } from "express"
import { IRequestProduct, IResponse } from "../ultil/type";
import cloudinary from "../config/cloudinary";
import { Product } from "../model/product";
import { AppDataSource } from "../config/database";
import { Variant } from "../model/variant";
import { Collection } from "../model/collection";
import { Like } from "typeorm";

class productController{
    create = async (req: Request, res:Response) =>{
        const data: IRequestProduct =  req.body;
        let response: IResponse = {
            success: false,
            data: null,
            message: "cannot create product",
            error:{
                field:"",
                message:""
            }
        }
        if(data.name === "" && data.regularPrice == ""){
            return response
        }
        try {
            cloudinary.uploader.upload(
                data.image as string,
                {
                    upload_preset: "image_preset"
                },
                async (error: any, result: any) =>{
                    if(error){
                        response.error = {
                            field:"image",
                            message:"could not upload image"
                        }
                        console.log(error);
                        response.message = "could not upload image" + error.toString()
                        return res.status(400).json(response)
                    }
                    let collection = await AppDataSource.manager.findOne(Collection, {
                        where:{
                            id: data.collectionId,
                        }
                    })
                    if(collection){
                        if(data.id !== undefined &&  data.id !== "create"){
                            const product = await AppDataSource.manager.findOneBy(Product, {id: +data.id});
                            if(product !== null){
                                product.id = Number(data.id)
                                product.name = data.name
                                product.description = data.description
                                product.image = result.url
                                product.regularPrice = data.regularPrice
                                product.salePrice = data.salePrice
                                product.collection = collection
                                const resultSave = await AppDataSource.manager.save(Product, product);
                                if(resultSave){
                                    if(data.variantId.length >0){
                                        const dataVariants = data.variantName.map(async (variantName, index) =>{
                                            const newVariant = await AppDataSource.manager.save(Variant, {
                                                id: data.variantId[index],
                                                title: data.variantType[index],
                                                value: JSON.stringify(variantName.slice(0, variantName.length - 1)),
                                                price: JSON.stringify(data.variantPrice[index].slice(0, data.variantName[index].length - 1)),
                                                product: product
                                            })
                                            return newVariant
                                        })
                                        if(dataVariants && dataVariants.length === data.variantName.length){
                                            response = {
                                                success: true,
                                                data: resultSave,
                                                message: "update product successfully",
                                                error:{
                                                    field:"",
                                                    message:""
                                                }
                                            }
                                            return res.status(200).json(response)
                                        }
                                        response.message = "update variant failure"
                                        return res.status(400).json(response)
                                    }else{
                                        response.message = "update variant failure"
                                        return res.status(400).json(response)
                                    }
                                }else{
                                    response.message = "update product failure"
                                    return res.status(400).json(response)
                                }

                            }
                            
                        }
                        let product = new Product();
                        product.name = data.name
                        product.description = data.description
                        product.image = result.url
                        product.regularPrice = data.regularPrice
                        product.salePrice = data.salePrice
                        product.collection = collection
                        const resultSave = await AppDataSource.manager.save(Product, product)
                        if(resultSave){
                            const dataVariants = data.variantName.map(async (variantName, index) =>{
                                const newVariant = await AppDataSource.manager.save(Variant, {
                                    title: data.variantType[index],
                                    value: JSON.stringify(variantName.slice(0, variantName.length - 1)),
                                    price: JSON.stringify(data.variantPrice[index].slice(0, data.variantName[index].length - 1)),
                                    product: product
                                })
                                return newVariant
                            })
                            
                            if(dataVariants && dataVariants.length === data.variantName.length){
                                response = {
                                    success: true,
                                    data: resultSave,
                                    message: "create product successfully",
                                    error:{
                                        field:"",
                                        message:""
                                    }
                                }
                                return res.status(200).json(response)
                            }
                            response.message = "create variant failure"
                            return res.status(400).json(response)
                        }
                        return res.status(200).json(response)
                    }
                    response.message = "collection doesn't exit"
                    return res.status(200).json(response)
                })
            } catch (err) {
                console.log(err);
                return res.status(400).json({msg: err})
            }
        };
        async getAllProduct(req: Request, res:Response){
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not get all product"
            }
            try{
                const allProduct = await AppDataSource.manager.find(Product,{
                    relations:{
                        collection: true,
                    }
                })
                if(allProduct && allProduct.length > 0){
                    result.success = true;
                    result.data = allProduct,
                    result.message = "get all product successfully"
                }
                res.status(200).json(result)
            }catch(e: any){
                result.message = e.toString();
                res.status(400).json(result)
            }
        };
        async getProductById(req: Request, res:Response){
            const id = req.query.id as string;
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not get product"
            }
            try{
                const product = await AppDataSource.manager.findOne(Product, {
                    where:{
                        id: +id,
                    },
                    relations:{
                        variants: true,
                        collection: true
                    }
                })
                if(product){
                    result.success = true;
                    result.data = product,
                    result.message = "get product by id successfully"
                }
                res.status(200).json(result)
            }catch(e: any){
                result.message = e.toString();
                res.status(400).json(result)
            }
        };
        async getProductByName(req: Request, res: Response){
            const name = req.query.name as string;
            let result: IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not get product"
            }
            try{
                const product = await AppDataSource.manager.find(Product, {
                    where:{
                        name: Like(`%${name}%`),
                    },
                    relations:{
                        variants: true,
                        collection: true
                    }
                })
                if(product && product.length > 0){
                    result.success = true;
                    result.data = product,
                    result.message = "get product by name successfully"
                }
                res.status(200).json(result)
            }catch(e: any){
                result.message = e.toString();
                res.status(400).json(result)
            }
        }; 
        async deleteProductbyId(req: Request, res: Response){
            const id = req.body.id;
            
            let result: IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not delete product"
            }
            try{
                const product = await AppDataSource.manager.delete(Product, {
                    id: id
                })
                if(product){
                    result.success = true;
                    result.data = product,
                    result.message = "delete product successfully"
                }
                res.status(200).json(result)
            }catch(e: any){
                result.message = e.toString();
                res.status(400).json(result)
            }
        }
}

export default new productController
