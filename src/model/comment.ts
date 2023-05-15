import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Product } from "./product";

@Entity()
export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    image: string

    @Column()
    description: string

    @Column()
    rate: number

    @ManyToOne(() => User, user => user.comments)
    user: User

    @ManyToOne(() => Product, product => product.comments, {
        onDelete: "CASCADE"
    })
    product: Product

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}