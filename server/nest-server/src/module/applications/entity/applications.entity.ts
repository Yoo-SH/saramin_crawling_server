import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from 'src/module/users/entity/users.entity';
import { Jobs } from 'src/module/jobs/entity/jobs.entity';
import { join } from 'path';

@Entity('applications')
export class Applications {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    resume: string;

    @Column({ default: 'applying' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Users, (user) => user.applications)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @ManyToOne(() => Jobs, (job) => job.applications)
    @JoinColumn({ name: 'job_id' })
    job: Jobs;
}