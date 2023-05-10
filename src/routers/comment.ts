import express from "express";
import commentController from "../controller/commentController";
const route  = express.Router();

route.post("/create", commentController.create)
route.get("/get-comment-product", commentController.getCommentByProduct)

export default route