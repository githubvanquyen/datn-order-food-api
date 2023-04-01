import productRouters from "./product";
import userRouters from "./user";
import { Express } from "express";

const route = (app: Express) =>{
    app.use("/product", productRouters)
    app.use("/user", userRouters)
}

export default route