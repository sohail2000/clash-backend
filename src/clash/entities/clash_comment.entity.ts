import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
import { Clash } from './clash.entity';
  
  @Entity()
  export class ClashComments {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Clash, (clash) => clash.ClashComments, { onDelete: 'CASCADE' })
    clash: Clash;
  
    @Column()
    comment: string;
  
    @CreateDateColumn()
    created_at: Date;
  }
  