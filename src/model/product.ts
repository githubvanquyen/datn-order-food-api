import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Collection } from "./collection";
import { Variant } from "./variant";
import { Order } from "./order";

@Entity()
export class Product extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    image: string

    @Column()
    description: string

    @Column()
    regularPrice: string

    @Column()
    salePrice: string
    
    @ManyToOne(() => Collection, collection => collection.products)
    @JoinColumn()
    collection: Collection

    @OneToMany(() => Variant, variant => variant.product)
    @JoinColumn()
    variants: Variant[]

    @ManyToOne(() => Order, order => order.products)
    @JoinColumn()
    order: Order
}