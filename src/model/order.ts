import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Collection } from "./collection";
import { Product } from "./product";
import { Variant } from "./variant";
import { User } from "./user";

@Entity()
export class Order extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    note: string

    @Column()
    addressShiping: string

    @Column()
    methodPayment: string

    @Column()
    totalPrice: number

    @Column()
    status: string
    
    @OneToMany(() => Product, product => product.order)
    products: Product[]
    
    @ManyToOne(() => User, user => user.orders)
    user?: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}