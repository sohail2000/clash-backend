import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    Index,
    CreateDateColumn,
  } from 'typeorm';
import { ClashItem } from './clash_item.entity';
import { ClashComments } from './clash_comment.entity';
import { User } from 'src/user/entities/user.entity';
  
  @Entity()
  @Index('IDX_CLASH_EXPIRE_TITLE', ['expire_at', 'title'])
  export class Clash {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.Clash, { onDelete: 'CASCADE' })
    user: User;
  
    @Column()
    title: string;
  
    @Column({ nullable: true })
    description?: string;
  
    @Column()
    image: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @Column({ type: 'timestamp' })
    expire_at: Date;
  
    @OneToMany(() => ClashItem, (clashItem) => clashItem.clash)
    ClashItem: ClashItem[];
  
    @OneToMany(() => ClashComments, (clashComments) => clashComments.clash)
    ClashComments: ClashComments[];
  }
  