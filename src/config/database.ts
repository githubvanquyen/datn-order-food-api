import {DataSource} from "typeorm"
import { User } from "../model/user"
import { Store } from "../model/store"
import { Product } from "../model/product"
import * as dotenv from "dotenv"
import { Collection } from "../model/collection"
import { Variant } from "../model/variant"
import { Order } from "../model/order"
import { Comment } from "../model/comment"
import { Flashsale } from "../model/flashsale"
import { Discounts } from "../model/discounts"
import { Blog } from "../model/blog"
dotenv.config()

const {HOST, PORT_DB,PASSWORD, DATABASE, USERNAME} = process.env

export const AppDataSource = new DataSource({
    type: "mysql",
    host: HOST,
    port: PORT_DB as number | undefined,
    username: "root",
    password: PASSWORD,
    database: DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Store, Collection, Variant, Product, Order, Comment, Flashsale, Discounts, Blog]
})