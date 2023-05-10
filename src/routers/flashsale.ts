import express from "express";
import flashsaleController from "../controller/flashsaleController";
const route  = express.Router();

route.post("/create", flashsaleController.createOrUpdate)
route.get("/get-all-flashsale", flashsaleController.getAllFls)
route.get("/get-fls-by-id", flashsaleController.getFlsById)
route.post("/deleteFls", flashsaleController.deleteFls)
route.get("/get-flashsale-datenow", flashsaleController.getFlsByDateNow)

export default route