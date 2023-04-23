import productRouters from "./product";
import userRouters from "./user";
import collectionRouters from "./collection";
import paymentRouters from "./payment";
import orderRouters from "./order";
import { Express } from "express";

const route = (app: Express) =>{
    app.use("/api/product", productRouters)
    app.use("/api/user", userRouters)
    app.use("/api/collection", collectionRouters)
    app.use("/api/payment", paymentRouters)
    app.use("/api/order", orderRouters)
}

export default route