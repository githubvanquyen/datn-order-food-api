import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { Product } from "./product";

@Entity()
export class Collection extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    image: string

    @OneToMany(()=> Product, product => product.collection)
    @JoinColumn()
    products: Product[]
}