import "reflect-metadata";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import route from "./routers";
import bodyParser from "body-parser";
dotenv.config();
const app = express()
import { AppDataSource } from "./config/database";


const PORT = process.env.PORT || 4000;

app.set('trust proxy', 1)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
route(app)

AppDataSource.initialize()
    .then(() =>{
        console.log("database connected successfull")
    })
    .catch((err) =>{
        console.log("database connected failure ", err)
    })
app.listen(PORT, () =>{
    console.log(`app is running at http://localhost:${PORT}`)
})