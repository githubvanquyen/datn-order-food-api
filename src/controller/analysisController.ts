import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Comment } from "../model/comment";
import { Product } from "../model/product";
import { User } from "../model/user";
import { Flashsale } from "../model/flashsale";
import { Between, In } from "typeorm";
import dateFormat from "../ultil/dateFormat";
import { log } from "console";
import { Order } from "../model/order";

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

class analysisController {
    getAnalysis = async (req: Request, res: Response) =>{
        const result:IResponse = {
            success: false,
            data: null,
            message: "Could not get analysis"
        }
        try {
            const orders = await AppDataSource.manager.find(Order);
            const users = await AppDataSource.manager.find(User);
            const products = await AppDataSource.manager.find(Product);
            const flashsale = await AppDataSource.manager.find(Flashsale);
            const date = new Date();
            const month = date.getMonth();
            let t0 = new Date();
            let t1 = new Date();
            let t2 = new Date();
            let t3 = new Date();
            t0.setMonth(month - 3);
            t1.setMonth(month - 2);
            t2.setMonth(month - 1);
            t3.setMonth(month);
            const orderT0 = await AppDataSource.manager.find(Order, {where: {createdAt: Between(t0, t1)}})
            const orderT1 = await AppDataSource.manager.find(Order, {where: {createdAt: Between(t1, t2)}})
            const orderT2 = await AppDataSource.manager.find(Order, {where: {createdAt: Between(t2, t3)}})
            if(orders){
                const orderNotConfirm =  orders.filter(item => (item.statusOrder === "-1"))
                const orderConfirm =  orders.filter(item => (item.statusOrder === "0"))
                const orderSuccess =  orders.filter(item => (item.statusOrder === "1"))
                result.success = true;
                result.data = {
                    orders: {
                        notConfirm: orderNotConfirm.length,
                        confirm: orderConfirm.length,
                        orderSuccess: orderSuccess.length
                    },
                    ordersPriceMonth :[
                        orderT0.length,
                        orderT1.length,
                        orderT2.length 
                    ],
                    product: products.length,
                    order: orders.length,
                    user: users.length,
                    flashsale: flashsale.length
                };
                result.message = "get analysis succesfully";
                res.status(200).json(result);
            }else{
                res.status(400).json(result);
            }
        } catch (error) {
            result.message = "get flash sale internal server error" + error;
            res.status(500).json(result);
        }
    };

}

export default new analysisController