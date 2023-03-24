import productRouters from "./product";
import { Express } from "express";

const route = (app: Express) =>{
    app.use("/product", productRouters)
}

export default route