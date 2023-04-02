import { BaseEntity, Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class Product extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    images: string

    @Column()
    description: string

    @Column()
    regularPrice: string

    @Column()
    salePrice: string
}