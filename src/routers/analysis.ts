import express from "express";
import analysisController from "../controller/analysisController";
const route  = express.Router();

route.get("/get-all-analysis", analysisController.getAnalysis)

export default route