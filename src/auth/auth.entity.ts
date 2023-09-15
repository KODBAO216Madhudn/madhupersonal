import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique: true})
    uname: string;

    @Column()
    upass: string;
}