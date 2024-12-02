// Bookmark Entity
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from '../../users/entity/users.entity';
import { Jobs } from '../../jobs/entity/jobs.entity';

@Entity()
export class Bookmark {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


    @ManyToOne(() => Users, (user) => user.bookmarks)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @ManyToOne(() => Jobs, (job) => job.bookmarks)
    @JoinColumn({ name: 'job_id' })
    job: Jobs;

    // 필요한 경우 다른 메타데이터를 추가할 수 있습니다.
}
