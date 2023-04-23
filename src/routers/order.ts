import express from "express";
import orderController from "../controller/orderController";
const route  = express.Router();

route.get("/get-all-order", orderController.getAllOrder)

export default route