import express from "express";
import userController from "../controller/userController";
const route  = express.Router();

route.post("/register", userController.register);
route.post("/login", userController.login);
route.post("/checkAuth", userController.checkAuth);
route.get("/get-all-user", userController.getAllUser);
route.get("/get-user-by-id", userController.getUserById);
route.get("/get-user-by-name", userController.getUserByName);

export default route
