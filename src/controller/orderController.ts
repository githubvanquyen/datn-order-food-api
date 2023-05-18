import { Request, Response } from "express"
import { IResponse, productReq } from "../ultil/type";
import { AppDataSource } from "../config/database";
import { Order } from "../model/order";
import { Between, LessThanOrEqual } from "typeorm";
import dateFormat from "../ultil/dateFormat";

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
                },
            });
            if(orders && orders.length  > 0){
                result.success = true;
                result.message = "get all order successfully";
                result.data = orders.reverse();
            }
            res.status(200).json(result);
        } catch (error) {
            result.message = "get all order failure";
            res.status(400).json(result);
        }
    }
    getOrderById = async (req: Request, res: Response)=>{
        const id = req.query.id as string;
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
            const orders = await AppDataSource.manager.findOne(Order,{
                where:{
                    id: +id
                },
                relations:{
                    user: true,
                    products:{
                        variants: true
                    },
                    discount: true
                }
            });
            if(orders){
                result.success = true;
                result.message = "get order successfully";
                const products = orders.products.map(product =>({
                    ...product,
                    variants: product.variants.map(variant =>(
                        {
                            ...variant,
                            price: JSON.parse(variant.price),
                            value: JSON.parse(variant.value)
                        }
                    ))    
                }))
                result.data = {
                    ...orders,
                    variant: JSON.parse(orders.variant),
                    quantityPerProduct: JSON.parse(orders.quantityPerProduct),
                    totalPricePerProduct: JSON.parse(orders.totalPricePerProduct),
                    products: products,
                };
            }
            res.status(200).json(result);
        } catch (error) {
            result.message = "get order failure";
            res.status(400).json(result);
        }
    }
    updateStatusOrder =  async (req: Request, res: Response)=>{
        const statusOrder = req.body.statusOrder as string;
        const statusPayment = req.body.statusPayment as string;
        const id = req.body.id as string;
        const result:IResponse = {
            success: true,
            data: {},
            error:{
                field:"",
                message:""
            },
            message:""
        }
        try {
            let hasOrder =  await AppDataSource.manager.findOne(Order,{
                where: {
                    id: +id,
                }
            })
            if(hasOrder !== null){
                hasOrder.statusOrder = statusOrder;
                hasOrder.statusPayment = statusPayment
                const updateOrder = await AppDataSource.manager.save(Order, hasOrder)
                if(updateOrder !== null){
                    result.success = true;
                    result.message = "update order successfully";
                    result.data = updateOrder
                }
            }
            res.status(200).json(result);
        } catch (error) {
            result.message = "update order failure" +error;
            res.status(400).json(result);
        }
    }
    getOrderByCustomer = async (req: Request, res: Response)=>{
        const id = req.query.id as string;
        
        let result:IResponse = {
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
                where:{
                    user: {
                        id: +id
                    }
                },
                relations:{
                    products:{
                        variants: true
                    }
                },
                order:{
                    createdAt: "DESC",
                }
            });
            
            if(orders && orders.length > 0){
                result.success = true;
                result.message = "get order successfully";
                const dataFormated = orders.map((order) =>{
                    return {
                        ...order,
                        variant: JSON.parse(order.variant),
                        quantityPerProduct: JSON.parse(order.quantityPerProduct),
                        totalPricePerProduct: JSON.parse(order.totalPricePerProduct),
                        products: order.products.map(product =>({
                            ...product,
                            variants: product.variants.map(variant =>(
                                {
                                    ...variant,
                                    price: JSON.parse(variant.price),
                                    value: JSON.parse(variant.value)
                                }
                            ))    
                        }))
                    }
            })                
                result.data =  dataFormated;
            }
            res.status(200).json(result);
        } catch (error) {
            result.message = "get order failure " +error;
            res.status(400).json(result);
        }
    }
    getOrderByTime = async (req: Request, res: Response)=>{        
        let result:IResponse = {
            success: false,
            data: [],
            error:{
                field:"",
                message:""
            },
            message:"Could not get order by time"
        }
        try {
            let orderPrice: number[] = [];
            const time = [0, 3, 6, 9, 12, 15, 18, 21];
            await Promise.all( time.map(async(item) =>{
                const date = new Date();
                date.setHours(item, 0, 0, 0)
                const dateEnd = new Date()
                dateEnd.setHours(item + 3, 0, 0, 0)
                const orders = await AppDataSource.manager.find(Order,{
                    where:{
                        createdAt: Between(date, dateEnd)
                    },
                });
                let totalPrice = 0;
                
                if(orders && orders.length > 0) {
                    orders.forEach((order) =>{
                        totalPrice += order.totalPrice
                    })
                    orderPrice.push(totalPrice)
                }else{
                    orderPrice.push(0)
                }
            }))
                console.log("result", orderPrice);
                result.success = true;
                result.message = "get order by date successfully";
                result.data = orderPrice;
                res.status(200).json(result);
            
        } catch (error) {
            result.message = "get order failure " +error;
            res.status(400).json(result);
        }
    }
}

export default new orderController