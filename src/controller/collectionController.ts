import { Request, Response } from "express"
import { IRequestCollection, IResponse } from "../ultil/type";
import cloudinary from "../config/cloudinary";
import { Product } from "../model/product";
import { AppDataSource } from "../config/database";
import { Collection } from "../model/collection";
import { In, Like } from "typeorm";

class collectionController{
    create = async (req: Request, res:Response) =>{
        const data: IRequestCollection =  req.body;
        let response: IResponse = {
            success: false,
            data: null,
            message: "cannot create collection",
            error:{
                field:"",
                message:""
            }
        }
        if(data.name === ""){
            response.error = {
                field: "name",
                message: "Could not empty"
            }
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
                        response.success = false
                        console.log(error);
                        response.message = "could not upload image" + error.toString()
                        return res.status(200).json(response)
                    }
                    const products = await AppDataSource.manager.find(Product, {
                        where:{
                            id: In(data.productIds)
                        }
                    })
                    let collection = new Collection();
                    if(data.id !== "create"){
                        collection.id = Number(data.id)
                    }
                    collection.name = data.name
                    collection.image = result.url
                    collection.products = products
                    const resultSave = await AppDataSource.manager.save(Collection, collection)
                    if(resultSave){
                        response = {
                            success: true,
                            data: resultSave,
                            message: "create collection successfully",
                            error:{
                                field:"",
                                message:""
                            }
                        } 
                        return res.status(200).json(response)
                    }
                    return res.status(400).json(response)
                })
            } catch (err) {
                console.log(err);
                return res.status(400).json({msg: err})
            }
        };
        async getAllCollection(req: Request, res:Response){
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not get all collection"
            }
            try{
                const getAllCollection = await AppDataSource.manager.find(Collection, {
                    relations:{
                        products: true
                    }
                })
                if(getAllCollection && getAllCollection.length > 0){
                    result.success = true;
                    result.data = getAllCollection,
                    result.message = "get all collection successfully"
                }
                res.status(200).json(result)
            }catch(e: any){
                result.message = e.toString();
                res.status(400).json(result)
            }
        };
        async getCollectionByName(req: Request, res:Response){
            const queryName = req.query.name;
            
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not get collection"
            }
            try{
                const getCollection = await AppDataSource.manager.findBy(Collection, { name: Like(`%${queryName}%`)})
                if(getCollection && getCollection.length > 0){
                    result.success = true;
                    result.data = getCollection,
                    result.message = "get collection successfully"
                }
                res.status(200).json(result)
            }catch(e: any){
                result.message = e.toString();
                res.status(400).json(result)
            }
        };
        async getCollectionById(req: Request, res:Response){
            let id = req.query.id?.toString();
            console.log("id", id)
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not get collection"
            }
            if(id === undefined){
                result.message = "missing params !";
            }else{
                try{
                    const getCollection = await AppDataSource.manager.findOne(Collection, {
                        where:{
                            id: +id,
                        },
                        relations:{
                            products: true
                        }
                    })
                    if(getCollection){
                        result.success = true;
                        result.data = getCollection,
                        result.message = "get collection by id successfully"
                    }
                    res.status(200).json(result)
                }catch(e: any){
                    result.message = e.toString();
                    res.status(400).json(result)
                }
            }
            
        };
        async deleteCollectionById(req: Request, res:Response){
            let id = req.body.id?.toString();
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not delete collection"
            }
            if(id === undefined){
                result.message = "missing params !";
                res.status(200).json(result)
            }else{
                try{
                    // const productOfCollection = await AppDataSource.manager.findOne(Collection, {
                    //     where:{
                    //         id: id,
                    //     },
                    //     relations:{
                    //         products: true
                    //     }
                    // })
                    // console.log(productOfCollection);
                    
                    // if(productOfCollection){
                       
                    // }
                    const deleteCollection = await AppDataSource.manager.delete(Collection, {
                        id: id,
                        
                    })
                    if(deleteCollection){
                        result.success = true;
                        result.data = deleteCollection,
                        result.message = "delete collection by id successfully"
                    }
                    res.status(200).json(result)
                }catch(e: any){
                    result.success = false,
                    result.message = e.toString();
                    res.status(200).json(result)
                }
            }
            
        }
}

export default new collectionController