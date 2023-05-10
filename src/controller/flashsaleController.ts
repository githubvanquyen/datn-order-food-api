import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Comment } from "../model/comment";
import { Product } from "../model/product";
import { User } from "../model/user";
import { Flashsale } from "../model/flashsale";
import { In } from "typeorm";
import dateFormat from "../ultil/dateFormat";
import { log } from "console";

interface FlsReq{
    id: string
    discountValue: string
    discountType: number
    productIds: number[]
    dateStart: string
    dateEnd: string
}
interface IResponse {
    success: boolean,
    data: any,
    message: string,
}

class flashsaleController {
    createOrUpdate= async (req: Request, res: Response) =>{
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not create flashsale"
        }
        const {discountType, discountValue, productIds, dateEnd, dateStart, id}:FlsReq = req.body;
        try {
            if(id === "create"){
                const products = await AppDataSource.manager.find(Product, {
                    where:{
                        id: In(productIds)
                    }
                })
                const newFls = await AppDataSource.manager.save(Flashsale, {
                    discountType: discountType,
                    discountValue: discountValue,
                    dateEnd: dateEnd,
                    dateStart: dateStart,
                    products: products
                })
                if(newFls){
                    result.success = true;
                    result.data = newFls;
                    result.message = "Create flash sale successfully";
                    res.status(200).json(result);
                } else {
                    res.status(400).json(result)
                }
            }else{
                const flashsale = await AppDataSource.manager.findOne(Flashsale, {where: {id: +id}});
                if(flashsale !== null){
                    const products = await AppDataSource.manager.find(Product, {
                        where:{
                            id: In(productIds)
                        }
                    })
                    const updateFls =  await AppDataSource.manager.save(Flashsale, {
                        id: flashsale.id,
                        discountType: discountType,
                        discountValue: discountValue,
                        dateEnd: dateEnd,
                        dateStart: dateStart,
                        products: products
                    })
                    if(updateFls){
                        result.message = "update flashsale successfully",
                        result.data = updateFls,
                        result.success = true
                        res.status(200).json(result)
                    }else {
                        result.message = "update flashsale failure",
                        res.status(400).json(result)
                    }
                }
            }
        } catch (error) {
            result.message = "create flash sale have internal server error" + error;
            res.status(500).json(result);
        }
    };

    getAllFls = async (req: Request, res: Response) =>{
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not get all flash sale"
        }
        try {
            const fls = await AppDataSource.manager.find(Flashsale, {
                relations: {
                    products: true
                }
            });
            if(fls){
                result.success = true;
                result.data = fls;
                result.message = "get all flash sale succesfully";
                res.status(200).json(result);
            }
        } catch (error) {
            result.message = "get all flash sale internal server error" + error;
            res.status(500).json(result);
        }
    };

    getFlsById = async (req: Request, res: Response) =>{
        const id = req.query.id as string;
        
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not get flash sale by id"
        }
        try {
            const fls = await AppDataSource.manager.findOne(Flashsale, {
                where: {
                    id: +id
                },
                relations: {
                    products: true
                }
            });
            if(fls){
                result.success = true;
                result.data = fls;
                result.message = "get flash sale succesfully";
                res.status(200).json(result);
            }else{
                res.status(400).json(result);
            }
        } catch (error) {
            result.message = "get flash sale internal server error" + error;
            res.status(500).json(result);
        }
    };

    getFlsByDateNow = async (req: Request, res: Response) =>{
        const date = new Date();
        
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not get flash sale date now"
        }
        try {
            const fls = await AppDataSource.manager.find(Flashsale, {
                relations: {
                    products: true
                }
            });
            const flashSaleNow = fls.filter((item) => {
                const dt =  new Date(item.dateStart); 
                const de = new Date(item.dateEnd); 
                return(dt < date && de > date)
            })
            
            if(flashSaleNow && flashSaleNow.length > 0){
                result.success = true;
                result.data = fls[0];
                result.message = "get flash sale now succesfully";
            }
            res.status(200).json(result);
        } catch (error) {
            result.message = "get flash sale internal server error" + error;
            res.status(500).json(result);
        }
    };

    deleteFls = async (req: Request, res: Response) =>{
        const id = req.body.id;
        
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not delete flash sale"
        }
        try {
            const fls = await AppDataSource.manager.delete(Flashsale, {
                id: +id
            });
            if(fls){
                result.success = true;
                result.data = fls;
                result.message = "delete flash sale succesfully";
                res.status(200).json(result);
            }else{
                res.status(400).json(result);
            }
        } catch (error) {
            result.message = "delete flash sale internal server error" + error;
            res.status(500).json(result);
        }
    }

}

export default new flashsaleController