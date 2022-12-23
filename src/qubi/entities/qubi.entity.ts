import { UserEntity } from "src/users/entities/user.entity";
import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'qubis' })
export class QubiEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column({ default: 1 })
    duration: number;

    @Column({ default: 5 })
    amount: number;

    @Column({ default: 0 })
    userCount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @OneToMany(() => UserEntity, userEntity => userEntity.qubi, { cascade: ['remove'] })
    memebers: UserEntity[]

    @BeforeInsert()
    insertEndDate() {

        console.log(this.duration);
        this.endDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + this.duration,
            new Date().getDate(),
        );
    }


}