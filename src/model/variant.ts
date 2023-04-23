import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product";

@Entity()
export class Variant extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    value: string

    @Column()
    price: string

    @ManyToOne(()=> Product, product => product.variants)
    product: Product
}