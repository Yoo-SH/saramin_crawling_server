import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Users } from 'src/module/users/entity/users.entity';
import { Jobs } from 'src/module/jobs/entity/jobs.entity';

@Entity('applications')
export class Applications {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    resume: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Users, (user) => user.applications)
    user: Users;

    @ManyToOne(() => Jobs, (job) => job.applications)
    job: Jobs;
}