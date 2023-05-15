import express from "express";
import blogController from "../controller/blogController";
const route  = express.Router();

route.get("/get-all-blog", blogController.getAllBlog)
route.get("/get-blog-by-id", blogController.getBlogById)
route.post("/create", blogController.create)
route.post("/delete", blogController.deleteBlogById)

export default route
