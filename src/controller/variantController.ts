import { Request, Response } from "express"
import { IResponse } from "../ultil/type"
import { AppDataSource } from "../config/database"
import { Variant } from "../model/variant"

class variantController {
    create = (req: Request, res: Response) =>{
        let {title, regularPrice, salePrice} = req.body
        let result: IResponse = {
            success: false,
            data: null,
            message: "Could not create variant",
            error:{
                field: "",
                message:""
            }
        }
        // try{
        //     const newVariant = AppDataSource.manager.create(Variant, {
        //         title: title,
        //         regularPrice: regularPrice,
        //         salePrice: salePrice,
        //     })
        //     if(newVariant){
        //         result.data = newVariant,
        //         result.success = true,
        //         result.message = "creat new variant succesfully"
        //         res.status(200).json(result)
        //     }
        //     else{
        //         res.status(400).json(result)
        //     }
        // }catch(err:any){
        //     result.message = err.toString();
        //     res.status(400).json(result)
        // }
    }
}

export default new variantController