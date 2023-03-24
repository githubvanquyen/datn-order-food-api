import "reflect-metadata";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import route from "./routers";
dotenv.config();
const app = express()
import { AppDataSource } from "./config/database";


const PORT = process.env.PORT || 4000;
route(app)

app.set('trust proxy', 1)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors())

AppDataSource.initialize()
    .then(() =>{
        console.log("database connected successfull")
    })
    .catch((err) =>{
        console.log("database connected failure ", err)
    })
app.listen(PORT, () =>{
    console.log(`app is runnit at http://localhost:${PORT}`)
})