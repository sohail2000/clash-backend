import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
import { Clash } from './clash.entity';
  
  @Entity()
  export class ClashItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Clash, (clash) => clash.ClashItem, { onDelete: 'CASCADE' })
    clash: Clash;
  
    @Column()
    image: string;
  
    @Column({ default: 0 })
    count: number;
  
    @CreateDateColumn()
    created_at: Date;
  }
  