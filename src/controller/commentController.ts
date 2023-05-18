import { Request, Response } from "express";
import { IResponse } from "../ultil/type";
import { AppDataSource } from "../config/database";
import { Comment } from "../model/comment";
import { Product } from "../model/product";
import { User } from "../model/user";

interface commentReq {
    image: any,
    description: string,
    userId: number,
    productId: number,
    rate: number
}

class commentController {
    create= async (req: Request, res: Response) =>{
        const result:IResponse = {
            success: false,
            data: null,
            error:{
                field: "",
                message: ""
            },
            message: "Could not create comment"
        }
        const {description, image, productId, userId, rate}:commentReq = req.body;
        try {
            const user = await AppDataSource.manager.findOne(User, { where: {id: userId}});
            if(!user || user === null){
                result.error = {
                    field: "user",
                    message: "You need login to create comment"
                }
                result.success = false;
                res.status(200).json(result);
            }else{
                const product = await AppDataSource.manager.findOne(Product, {where: {id: productId}});
                if(product){
                    const newComment = await AppDataSource.manager.save(Comment, {
                        image: image,
                        description: description,
                        user: user,
                        product: product,
                        rate: rate,
                    })
                    if(newComment){
                        result.success = true;
                        result.data = newComment;
                        result.message = "Create comment successfully";
                        res.status(200).json(result);
                    }
                }
            }
        } catch (error) {
            result.message = "create comment internal server error" + error;
            res.status(500).json(result);
        }
    };

    getCommentByProduct= async (req: Request, res: Response) =>{
        const productId = req.query.productId as string;
        
        const result:IResponse = {
            success: false,
            data: null,
            error:{
                field: "",
                message: ""
            },
            message: "Could not get comment by product"
        }
        try {
            const comments = await AppDataSource.manager.find(Comment, {
                where: {
                    product:{
                        id: +productId
                    }
                },
                relations:{
                    product: true,
                    user: true
                }
            });
            if(comments && comments.length > 0){
                result.success = true;
                result.data = comments;
                result.message = "get comment by product succesfully";
                res.status(200).json(result);
            }else{
                res.status(400).json(result);
            }
        } catch (error) {
            result.message = "create comment internal server error" + error;
            res.status(500).json(result);
        }
    }

}

export default new commentController