import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, JoinColumn, JoinTable, ManyToMany } from "typeorm";
import { Collection } from "./collection";
import { Variant } from "./variant";
import { Comment } from "./comment";
import { Order } from "./order";
import { Flashsale } from "./flashsale";
import { Discounts } from "./discounts";

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
    @JoinTable()
    orders: Order[]

    @ManyToOne(() => Flashsale, flashsale => flashsale.products)
    @JoinTable()
    flashsales: Flashsale[]
    
    @ManyToOne(() => Discounts, discount => discount.products)
    @JoinTable()
    discountCodes: Discounts[]
    
    @ManyToOne(() => Comment, comment => comment.product)
    @JoinColumn()
    comments: Comment
}