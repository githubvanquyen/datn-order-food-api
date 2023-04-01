import { Request, Response } from "express"
import { IRequestProduct, IResponse } from "../ultil/type";
import cloudinary from "../config/cloudinary";
import { Product } from "../models/product";
import { AppDataSource } from "../config/database";

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
                data.images as string,
                {
                    upload_preset: "images"
                },
                async (error: any, result: any) =>{
                    if(error){
                        response.message = "cannot upload image"
                        return res.status(400).json(response)
                    }
                    let product = new Product();
                    product.name = data.name
                    product.description = data.description
                    product.images = result;
                    product.variant = data.variant
                    product.regularPrice = data.regularPrice
                    product.salePrice = data.salePrice

                    const resultSave = await AppDataSource.manager.save(Product, product)
                    if(resultSave){
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
                    return res.status(200).json(response)
                })
            } catch (err) {
                console.log(err);
                return res.status(400).json({msg: err})
            }
        };
        getAllProduct(req: Request, res:Response){
            res.send("get all product ^^")
        }
}

export default new productController
