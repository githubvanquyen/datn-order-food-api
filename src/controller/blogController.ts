import { Request, Response } from "express"
import { IResponse } from "../ultil/type";
import cloudinary from "../config/cloudinary";
import { AppDataSource } from "../config/database";
import { Blog } from "../model/blog";

interface IRequestBlog {
    id: string
    image: any,
    title: string,
    content: string
}

class blogController{
    create = async (req: Request, res:Response) =>{
        const data: IRequestBlog =  req.body;
        let response: IResponse = {
            success: false,
            data: null,
            message: "cannot create blog",
            error:{
                field:"",
                message:""
            }
        }
        if(data.content === "" || data.title === ""){
            res.status(200).json(response)
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
                   
                    let blog = new Blog();
                    if(data.id !== "create"){
                        blog.id = Number(data.id)
                    }
                    blog.title = data.title
                    blog.image = result.url
                    blog.content = data.content
                    const resultSave = await AppDataSource.manager.save(Blog, blog)
                    if(resultSave){
                        response = {
                            success: true,
                            data: resultSave,
                            message: "create or update blog successfully",
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
        async getAllBlog (req: Request, res:Response){
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not get all blog"
            }
            try{
                const getAllBlog = await AppDataSource.manager.find(Blog)
                if(getAllBlog && getAllBlog.length > 0){
                    result.success = true;
                    result.data = getAllBlog,
                    result.message = "get all blog successfully"
                }
                res.status(200).json(result)
            }catch(e: any){
                result.message = e.toString();
                res.status(400).json(result)
            }
        };
        async getBlogById(req: Request, res:Response){
            let id = req.query.id?.toString();
            console.log("id", id)
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not get blog"
            }
            if(id === undefined){
                result.message = "missing params !";
            }else{
                try{
                    const getBlog = await AppDataSource.manager.findOne(Blog, {
                        where:{
                            id: +id,
                        }
                    })
                    if(getBlog){
                        result.success = true;
                        result.data = getBlog,
                        result.message = "get blog by id successfully"
                    }
                    res.status(200).json(result)
                }catch(e: any){
                    result.message = e.toString();
                    res.status(400).json(result)
                }
            }
            
        };
        async deleteBlogById(req: Request, res:Response){
            let id = req.body.id?.toString();
            let result:IResponse = {
                success: false,
                data: null,
                error: {
                    field: "",
                    message: "",
                },
                message:"Could not delete blog"
            }
            if(id === undefined){
                result.message = "missing params !";
                res.status(200).json(result)
            }else{
                try{
                    const deleteBlog = await AppDataSource.manager.delete(Blog, {
                        id: id,
                    })
                    if(deleteBlog){
                        result.success = true;
                        result.data = deleteBlog,
                        result.message = "delete blog by id successfully"
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

export default new blogController