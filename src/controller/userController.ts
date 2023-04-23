import { Request, Response } from "express";
import { IResponse } from "../ultil/type";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { AppDataSource } from "../config/database";

class userController{
    register = async (req: Request, res: Response) =>{
        let result: IResponse = {
            success: false,
            data: null,
            message: "Could not create new customer",
            error:{
                field: "",
                message: ""
            }
        }
        try {
            const {firstName, lastName, email, password} =  req.body;
            if(firstName !== "" && lastName !== "" && email !== "" && password !== ""){
                const hasUser = await AppDataSource.manager.find(User, {where: {email: email}});    
                 if(hasUser && hasUser.length > 0){
                    result.message = "user already exists";
                    result.error = {
                        field: "email",
                        message: "email already exists"
                    }
                    return res.status(400).json(result)
                }
                const hashPassword =  await argon2.hash(password, {hashLength: 10});
                if(hashPassword){
                    jwt.sign({firstName, lastName, email}, 'orderfood', {}, async (err, token) =>{
                        if(token){
                            try {
                                let newUser =  new User();
                                newUser.firstName =  firstName;
                                newUser.lastName = lastName;
                                newUser.email =  email;
                                newUser.password =  hashPassword;
                                newUser.token =  token;
                                newUser.role = 0;
                                const userSaved = await AppDataSource.manager.save(User, newUser);
                                if(userSaved){
                                    result.success = true
                                    result.data = {
                                        firstName: userSaved.firstName,
                                        lastName: userSaved.lastName,
                                        token: userSaved.token
                                    }
                                    result.message = "create new account successfully"
                                    res.status(200).json(result)
                                }
                            } catch (err:any) {
                                result.message = `create user have error: ${err.toString()}`
                                res.status(400).json(result)
                            }
                        }
                        if(err){
                            result.message = `create user have error: ${err.toString()}`
                            res.status(400).json(result)
                        }
                    })
                }else{
                    result.message = `create user have error when handle password`
                    res.status(400).json(result)
                }
            }else{
                result.message = `create user have error by missing field`
                res.status(400).json(result)
            }
        } catch (error) {
            result.message = error as string
            res.status(400).json(result)
        }
    };
    login = async (req: Request, res: Response) =>{
        let result: IResponse = {
            success: false,
            data: null,
            message: "login failure",
            error: {
                field: "",
                message: ""
            }
        }
        const {email, password} = req.body;
        if(email !== "" && password !== ""){
            const hasUser =  await AppDataSource.manager.findOne(User, {where:{email: email}})
            if(!hasUser){
                result = {
                    ...result,
                    message:"user doesn't existes",
                    error:{
                        field: "email",
                        message: "wrong email"
                    }
                }
                return res.status(400).json(result)
            }else{
                try {
                    const verifyPassword  =  await argon2.verify(hasUser.password, password);
                    if(verifyPassword){
                        result = {
                            ... result,
                            success: true,
                            data: {
                                firstName: hasUser.firstName,
                                lastName: hasUser.lastName,
                                token: hasUser.token
                            },
                            message: "login successfully",
                        }
                        res.status(200). json(result)
                    }
                } catch (error) {
                    result = {
                        ...result,
                        message: result.message + error
                        
                    }
                    res.status(400).json(result)
                }
            }
        }
    };
    checkAuth = (req: Request, res: Response) =>{
        const token = req.body.token;
        jwt.verify(token, "orderfood", {}, (error, tokenDecode) =>{
            if(tokenDecode){
                res.status(200).json({success: true, message: "verify token successfully"})
            }else{
                res.status(400).json({success: true, message: "verify token failure"})
            }
        })
    }
}

export default new userController