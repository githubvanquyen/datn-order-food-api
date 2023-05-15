import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Product } from "./product";
import { User } from "./user";

@Entity()
export class Discounts extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    value: string

    @Column()
    type: number

    @Column()
    maximumDiscount?: string

    @Column()
    minimumPrice?: string

    @Column()
    expiredDate: string

    @Column()
    quantity: number
    
    @ManyToMany(() => Product, product => product.discountCodes,{
        onDelete: "CASCADE"
    })
    @JoinTable()
    products?: Product[]
    
    @ManyToMany(() => User, user => user.discountCodes, {
        onDelete: "CASCADE"
    })
    @JoinTable()
    users?: User[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}