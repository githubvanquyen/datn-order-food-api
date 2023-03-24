import express from "express";
import productController from "../controller/productController";
const route  = express.Router();

route.get("/", productController.getAllProduct)
route.post("/create", productController.create)

export default route
