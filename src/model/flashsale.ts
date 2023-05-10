import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, JoinColumn } from "typeorm";
import { Product } from "./product";

@Entity()
export class Flashsale extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    discountValue: string

    @Column()
    discountType: number
   
    @ManyToMany(() => Product, product => product.flashsales)
    @JoinTable()
    products: Product[]

    @Column()
    dateStart: string

    @Column()
    dateEnd: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}