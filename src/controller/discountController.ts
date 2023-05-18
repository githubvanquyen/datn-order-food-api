import { Request, Response, application } from "express";
import { AppDataSource } from "../config/database";
import { Product } from "../model/product";
import { User } from "../model/user";
import { In } from "typeorm";
import { Discounts } from "../model/discounts";

interface DiscountReq{
    id: string
    name: string,
    value: string,
    type: number,
    minimumPrice: string,
    maximumDiscount: string,
    expiredDate: string,
    quantity: number,
    productIds: number[],
    customerIds: number[]
}
interface IResponse {
    success: boolean,
    data: any,
    message: string,
}

class discountController {
    createOrUpdate= async (req: Request, res: Response) =>{
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not create discount"
        }
        const {maximumDiscount, minimumPrice, name, value, type, productIds, customerIds, id, expiredDate, quantity}:DiscountReq = req.body;
        try {
            if(id === "create"){
                const products = await AppDataSource.manager.find(Product, {
                    where:{
                        id: In(productIds)
                    }
                })
                const customers =  await AppDataSource.manager.find(User, {
                    where:{
                        id: In(customerIds)
                    }
                })
                const newdiscount = await AppDataSource.manager.save(Discounts, {
                    name: name,
                    value: value,
                    type: type,
                    minimumPrice: minimumPrice,
                    maximumDiscount: maximumDiscount,
                    expiredDate: expiredDate,
                    quantity: quantity,
                    products: products,
                    users: customers
                })
                if(newdiscount){
                    result.success = true;
                    result.data = newdiscount;
                    result.message = "Create discount successfully";
                    res.status(200).json(result);
                } else {
                    res.status(400).json(result)
                }
            }else{
                const discount = await AppDataSource.manager.findOne(Discounts, {where: {id: +id}});
                if(discount !== null){
                    const products = await AppDataSource.manager.find(Product, {
                        where:{
                            id: In(productIds)
                        }
                    })
                    const customers = await AppDataSource.manager.find(User, {
                        where:{
                            id: In(customerIds)
                        }
                    })
                    const updateDiscount =  await AppDataSource.manager.save(Discounts, {
                        id: discount.id,
                        name: name,
                        value: value,
                        type: type,
                        minimumPrice: minimumPrice,
                        maximumDiscount: maximumDiscount,
                        expiredDate: expiredDate,
                        quantity: quantity,
                        products: products,
                        users: customers
                    })
                    if(updateDiscount){
                        result.message = "update discount successfully",
                        result.data = updateDiscount,
                        result.success = true
                        res.status(200).json(result)
                    }else {
                        result.message = "update discount failure",
                        res.status(400).json(result)
                    }
                }
            }
        } catch (error) {
            result.message = "create discount have internal server error" + error;
            res.status(500).json(result);
        }
    };

    getAllDiscount = async (req: Request, res: Response) =>{
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not get all discount"
        }
        try {
            const discounts = await AppDataSource.manager.find(Discounts, {
                relations: {
                    products: true,
                    users: true
                }
            });
            if(discounts){
                result.success = true;
                result.data = discounts;
                result.message = "get all discount succesfully";
                res.status(200).json(result);
            }
        } catch (error) {
            result.message = "get all discount internal server error" + error;
            res.status(500).json(result);
        }
    };

    getDiscountById = async (req: Request, res: Response) =>{
        const id = req.query.id as string;
        
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not get discount by id"
        }
        try {
            const discount = await AppDataSource.manager.findOne(Discounts, {
                where: {
                    id: +id
                },
                relations: {
                    users: true
                }
            });
            if(discount){
                result.success = true;
                result.data = discount;
                result.message = "get discount succesfully";
                res.status(200).json(result);
            }else{
                res.status(400).json(result);
            }
        } catch (error) {
            result.message = "get discount internal server error" + error;
            res.status(500).json(result);
        }
    };

    deleteDiscount = async (req: Request, res: Response) =>{
        const id = req.body.id;
        
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not delete discount"
        }
        try {
            const discount = await AppDataSource.manager.delete(Discounts, {
                id: +id
            });
            if(discount){
                result.success = true;
                result.data = discount;
                result.message = "delete discount succesfully";
                res.status(200).json(result);
            }else{
                res.status(400).json(result);
            }
        } catch (error) {
            result.message = "delete discount internal server error" + error;
            res.status(500).json(result);
        }
    }

}

export default new discountController