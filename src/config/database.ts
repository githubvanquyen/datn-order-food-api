import {DataSource} from "typeorm"
import { User } from "../entities/user"
import { Store } from "../entities/store"
import { Product } from "../entities/product"
import * as dotenv from "dotenv"
dotenv.config()

const {HOST, PORT_DB,PASSWORD, DATABASE} = process.env

export const AppDataSource = new DataSource({
    type: "mysql",
    host: HOST,
    port: PORT_DB as number | undefined,
    username: "admin",
    password: PASSWORD,
    database: DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Store, Product]
})