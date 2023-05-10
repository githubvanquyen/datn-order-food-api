import express from "express";
import collectionController from "../controller/collectionController";
const route  = express.Router();

route.get("/get-all-collection", collectionController.getAllCollection)
route.get("/get-collection-by-name", collectionController.getCollectionByName)
route.get("/get-collection-by-id", collectionController.getCollectionById)
route.post("/create", collectionController.create)
route.post("/delete", collectionController.deleteCollectionById)

export default route
