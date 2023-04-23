import { Request, Response } from "express"
import { IResponse, productReq } from "../ultil/type";
import { AppDataSource } from "../config/database";
import { Order } from "../model/order";

class orderController{
    getAllOrder = async (req: Request, res: Response)=>{
        const result:IResponse = {
            success: false,
            data: {},
            error:{
                field:"",
                message:""
            },
            message:""
        }
        try {
            const orders = await AppDataSource.manager.find(Order,{
                relations:{
                    user: true
                }
            });
            if(orders && orders.length  > 0){
                result.success = true;
                result.message = "get all order successfully";
                result.data = orders;
            }
            res.status(200).json(result);
        } catch (error) {
            result.message = "get all order failure";
            res.status(400).json(result);
        }
    }
}

export default new orderController