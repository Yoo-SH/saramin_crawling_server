import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Users } from '../../users/entity/users.entity';
import { OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Users)
    @JoinColumn()
    user: Users;
}