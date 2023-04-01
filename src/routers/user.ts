import express from "express";
import userController from "../controller/userController";
const route  = express.Router();

route.post("/register", userController.register);
route.post("/login", userController.login);
route.post("/checkAuth", userController.checkAuth);

export default route
