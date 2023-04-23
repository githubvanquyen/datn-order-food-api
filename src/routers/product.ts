import express from "express";
import productController from "../controller/productController";
const route  = express.Router();

route.get("/", productController.getAllProduct)
route.get("/get-all-product", productController.getAllProduct)
route.get("/get-product-by-id", productController.getProductById)
route.get("/get-product-by-name", productController.getProductByName)
route.delete("/delete", productController.deleteProductbyId)
route.post("/create", productController.create)

export default route
