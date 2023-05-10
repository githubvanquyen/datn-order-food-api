import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Order } from "./order";
import { Comment } from "./comment";
import { Discounts } from "./discounts";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    phoneNumber: string

    @Column()
    token: string

    @Column()
    role: number

    @OneToMany(() => Order, order => order.user)
    orders: Order[]

    @ManyToOne(() => Discounts, discount => discount.products)
    @JoinTable()
    discountCodes: Discounts[]

    @ManyToOne(() => Comment, comment => comment.user)
    comments: Comment
}