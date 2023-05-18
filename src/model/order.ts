import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Collection } from "./collection";
import { Product } from "./product";
import { Variant } from "./variant";
import { User } from "./user";
import { Discounts } from "./discounts";

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
    statusOrder: string

    @Column()
    statusPayment: string

    @Column()
    userName?: string

    @Column()
    phoneNumber: string

    @Column()
    totalPricePerProduct: string

    @Column()
    quantityPerProduct: string

    @Column()
    variant: string
    
    @ManyToMany(() => Product, product => product.orders, {
        onDelete: "CASCADE"
    })
    @JoinTable()
    products: Product[]
    
    @ManyToOne(() => User, user => user.orders, {
        onDelete: "CASCADE"
    })
    user?: User

    @ManyToOne(() => Discounts, discount => discount.orders, {
        onDelete: "CASCADE"
    })
    discount?: Discounts

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}