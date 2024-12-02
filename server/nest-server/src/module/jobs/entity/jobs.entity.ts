import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Jobs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    company: string;

    @Column()
    title: string;

    @Column()
    link: string;

    @Column()
    location: string;

    @Column()
    experience: string;

    @Column()
    education: string;

    @Column()
    employment_type: string;

    @Column()
    deadline: string;

    @Column()
    sector: string;

    @Column()
    salary: string;

    @Column({ default: 0 })
    viewCount: number;
}
