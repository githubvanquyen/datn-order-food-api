import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { Order } from "./order";

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
    token: string

    @Column()
    role: number

    @OneToMany(() => Order, order => order.user)
    orders: Order[]
}