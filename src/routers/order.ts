import express from "express";
import orderController from "../controller/orderController";
const route  = express.Router();

route.get("/get-all-order", orderController.getAllOrder)
route.get("/get-order-by-id", orderController.getOrderById)
route.put("/update-status-order", orderController.updateStatusOrder)
route.get("/get-order-by-customer", orderController.getOrderByCustomer)

export default route