import {
    BaseEntity, Column, Entity,
    JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

import { QubiEntity } from "../../qubi/entities/qubi.entity";
import { Roles } from "../types/roles.type";

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Roles, default: Roles.USER })
    role: Roles

    @Column({ default: 0 })
    max_many: number;

    @Column({ default: 0 })
    deposited_many: number;

    @Column({ default: 0 })
    left_many: number;

    @Column({ default: 0 })
    max_day: number;

    @Column({ default: 0 })
    deposited_day: number;

    @Column({ default: 0 })
    left_day: number;

    @Column({ default: 0 })
    withdraw: number;

    @ManyToOne(() => QubiEntity, qubiEntity => qubiEntity.memebers, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    qubi: QubiEntity;
}