import { Request, Response } from "express"
import { IRequestProduct, IResponse } from "../ultil/type";
import cloudinary from "../config/cloudinary";
import { Product } from "../entities/product";
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
                    let product = new Product();
                    product.name = data.name
                    product.description = data.description
                    product.images = result.url
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
                const allProduct = await AppDataSource.manager.find(Product)
                console.log(allProduct);
                if(allProduct && allProduct.length > 0){
                    result.success = true;
                    result.data = allProduct.map(product => ({...product, images: product.images.split(",")})),
                    result.message = "get all product successfully"
                }
                
            }catch(e: any){
                result.message = e.toString();
                res.status(400).json(result)
            }
        }
}

export default new productController
