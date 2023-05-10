import productRouters from "./product";
import userRouters from "./user";
import collectionRouters from "./collection";
import paymentRouters from "./payment";
import orderRouters from "./order";
import commentRouters from "./comment";
import flashsaleRouters from "./flashsale";
import discountRouters from "./discount";
import analysisRouters from "./analysis";
import { Express } from "express";

const route = (app: Express) =>{
    app.use("/api/product", productRouters)
    app.use("/api/user", userRouters)
    app.use("/api/collection", collectionRouters)
    app.use("/api/payment", paymentRouters)
    app.use("/api/order", orderRouters)
    app.use("/api/comment", commentRouters)
    app.use("/api/flashsale", flashsaleRouters)
    app.use("/api/discount", discountRouters)
    app.use("/api/analysis", analysisRouters)
}

export default route