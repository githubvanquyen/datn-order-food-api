import express from "express";
import paymentController from "../controller/paymentController";
const route  = express.Router();

route.post("/create", paymentController.create)

export default route