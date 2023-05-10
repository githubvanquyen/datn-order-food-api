import express from "express";
import discountController from "../controller/discountController";
const route  = express.Router();

route.post("/create", discountController.createOrUpdate)
route.get("/get-all-discount", discountController.getAllDiscount)
route.get("/get-discount-by-id", discountController.getDiscountById)
route.post("/deleteDiscount", discountController.deleteDiscount)

export default route