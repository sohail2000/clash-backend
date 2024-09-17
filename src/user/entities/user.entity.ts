import { Clash } from 'src/clash/entities/clash.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index('IDX_USER_NAME', ['name'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  password_reset_token?: string;

  @Column({ type: 'timestamp', nullable: true })
  token_send_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at?: Date;

  @Column({ nullable: true })
  email_verify_token?: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Clash, (clash) => clash.user)
  Clash: Clash[];
}

